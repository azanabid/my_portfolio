import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import contactRouter from './routes/contact.js'
import { getMailStatus } from './lib/smtpMailer.js'

const currentDir = path.dirname(fileURLToPath(import.meta.url))

function loadServerEnv() {
  const requestedMode = process.env.NODE_ENV || 'development'
  const envFiles = [
    path.resolve(currentDir, '.env'),
    path.resolve(currentDir, '.env.local'),
    path.resolve(currentDir, `.env.${requestedMode}`),
    path.resolve(currentDir, `.env.${requestedMode}.local`),
  ]

  const mergedValues = {}

  for (const envFile of envFiles) {
    if (!fs.existsSync(envFile)) continue
    Object.assign(mergedValues, dotenv.parse(fs.readFileSync(envFile)))
  }

  for (const [key, value] of Object.entries(mergedValues)) {
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = requestedMode
  }
}

loadServerEnv()

const app = express()
const port = process.env.PORT || 5000
const isProduction = process.env.NODE_ENV === 'production'

function parseAllowedOrigins(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function isAllowedOrigin(origin, allowedOrigins) {
  if (!origin) return true
  return allowedOrigins.includes(origin)
}

function setSecurityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  res.setHeader('Origin-Agent-Cluster', '?1')
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
  res.setHeader('X-DNS-Prefetch-Control', 'off')

  if (isProduction) {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    }

    res.setHeader(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "form-action 'self'",
        "script-src 'self'",
        "connect-src 'self'",
        "img-src 'self' data: https:",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
      ].join('; '),
    )
  }

  next()
}

const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS)
const corsOptions = {
  origin(origin, callback) {
    if (!isProduction) {
      callback(null, true)
      return
    }

    if (allowedOrigins.length === 0) {
      callback(null, false)
      return
    }

    if (isAllowedOrigin(origin, allowedOrigins)) {
      callback(null, true)
      return
    }

    callback(null, false)
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400,
  optionsSuccessStatus: 204,
}

app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(setSecurityHeaders)
app.use((_req, res, next) => {
  res.vary('Origin')
  next()
})
app.use(cors(corsOptions))
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Robots-Tag', 'noindex, nofollow')
  next()
})
app.use(express.json({ limit: '12kb', strict: true, type: 'application/json' }))
app.locals.mongoConnected = false

app.get('/api/health', (_req, res) => {
  const payload = { ok: true }

  if (!isProduction) {
    payload.storage = app.locals.mongoConnected ? 'mongodb' : 'memory'
    payload.mailConfigured = getMailStatus().configured
  }

  res.json(payload)
})

app.use('/api/contact', contactRouter)

app.use((error, req, res, next) => {
  if (error?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'Invalid JSON request body.' })
    return
  }

  if (!req.path.startsWith('/api/')) {
    next(error)
    return
  }

  console.error('API error:', error.message)
  res.status(500).json({ message: 'The server could not process this request.' })
})

if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(currentDir, '../client/dist')

  app.use(
    express.static(clientDist, {
      index: false,
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
          return
        }

        if (filePath.endsWith('.pdf')) {
          res.setHeader('Cache-Control', 'public, max-age=86400')
          return
        }

        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache')
        }
      },
    }),
  )

  app.get('*', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache')
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI)
      app.locals.mongoConnected = true
      console.log('Connected to MongoDB')
    } catch (error) {
      console.warn(`MongoDB unavailable, using memory storage: ${error.message}`)
    }
  } else {
    console.log('MONGODB_URI is not set. Contact submissions will use memory storage.')
  }

  app.listen(port, () => console.log(`Portfolio API listening on http://localhost:${port}`))
}

start()
