import net from 'node:net'
import tls from 'node:tls'

const DEFAULT_TO_EMAIL = 'azanabidkhawaja@gmail.com'

function readEnv(name) {
  return String(process.env[name] || '').trim()
}

function parseBoolean(value, fallback) {
  if (!value) return fallback
  return !['false', '0', 'no', 'off'].includes(value.toLowerCase())
}

function sanitizeHeader(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim()
}

function normalizeBody(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => (line.startsWith('.') ? `.${line}` : line))
    .join('\r\n')
}

function getMailConfig() {
  const user = readEnv('SMTP_USER')
  const pass = readEnv('SMTP_PASS') || readEnv('GMAIL_APP_PASSWORD')
  const host = readEnv('SMTP_HOST') || 'smtp.gmail.com'
  const port = Number(readEnv('SMTP_PORT') || 465)
  const secure = parseBoolean(readEnv('SMTP_SECURE'), true)
  const to = readEnv('MAIL_TO_EMAIL') || DEFAULT_TO_EMAIL
  const envelopeFrom = readEnv('SMTP_FROM_EMAIL') || user
  const headerFrom = readEnv('SMTP_FROM') || envelopeFrom
  const missing = []

  if (!user) missing.push('SMTP_USER')
  if (!pass) missing.push('SMTP_PASS')
  if (!to) missing.push('MAIL_TO_EMAIL')
  if (!envelopeFrom) missing.push('SMTP_FROM_EMAIL')

  return {
    host,
    port,
    secure,
    user,
    pass,
    to,
    envelopeFrom,
    headerFrom,
    missing,
    ready: Boolean(host && port && missing.length === 0),
  }
}

function createConfigError(message) {
  const error = new Error(message)
  error.code = 'EMAIL_NOT_CONFIGURED'
  return error
}

function connectSocket(config) {
  return new Promise((resolve, reject) => {
    const options = {
      host: config.host,
      port: config.port,
      servername: config.host,
      timeout: 15000,
    }

    const socket = config.secure
      ? tls.connect(options)
      : net.connect({ host: config.host, port: config.port })

    let settled = false

    const handleReady = () => {
      if (settled) return
      settled = true
      socket.setEncoding('utf8')
      socket.removeListener('error', handleError)
      resolve(socket)
    }

    const handleError = (error) => {
      if (settled) return
      settled = true
      reject(error)
    }

    const handleTimeout = () => {
      socket.destroy(new Error('SMTP connection timed out.'))
    }

    socket.once(config.secure ? 'secureConnect' : 'connect', handleReady)
    socket.once('error', handleError)
    socket.setTimeout(15000, handleTimeout)
  })
}

function createSmtpClient(socket) {
  let buffer = ''
  let closedError = null
  const queuedResponses = []
  const waiters = []

  function flushResponse(responseText) {
    const waiter = waiters.shift()
    if (waiter) {
      waiter.resolve(responseText)
      return
    }
    queuedResponses.push(responseText)
  }

  function rejectAll(error) {
    if (closedError) return
    closedError = error
    while (waiters.length > 0) {
      waiters.shift().reject(error)
    }
  }

  function extractResponses() {
    while (true) {
      let offset = 0
      const lines = []
      let complete = false

      while (true) {
        const endOfLine = buffer.indexOf('\r\n', offset)
        if (endOfLine === -1) return

        const line = buffer.slice(offset, endOfLine)
        lines.push(line)
        offset = endOfLine + 2

        if (/^\d{3} /.test(line)) {
          complete = true
          break
        }

        if (!/^\d{3}-/.test(line)) {
          continue
        }
      }

      if (!complete) return
      buffer = buffer.slice(offset)
      flushResponse(lines.join('\n'))
    }
  }

  socket.on('data', (chunk) => {
    buffer += chunk
    extractResponses()
  })

  socket.on('error', (error) => rejectAll(error))
  socket.on('close', () => rejectAll(new Error('SMTP connection closed unexpectedly.')))

  return {
    async read() {
      if (queuedResponses.length > 0) return queuedResponses.shift()
      if (closedError) throw closedError
      return new Promise((resolve, reject) => waiters.push({ resolve, reject }))
    },
    send(line) {
      socket.write(`${line}\r\n`)
    },
    sendData(message) {
      socket.write(`${message}\r\n.\r\n`)
    },
    close() {
      socket.end()
    },
  }
}

async function expectCode(client, expectedCodes, context) {
  const responseText = await client.read()
  const firstLine = responseText.split('\n')[0] || ''
  const code = Number(firstLine.slice(0, 3))

  if (!expectedCodes.includes(code)) {
    const error = new Error(`${context} failed: ${firstLine || responseText}`)
    error.code = 'SMTP_COMMAND_FAILED'
    throw error
  }

  return responseText
}

function buildEmail(submission, config) {
  const name = sanitizeHeader(submission.name)
  const email = sanitizeHeader(submission.email)
  const subject = sanitizeHeader(submission.subject)
  const textBody = normalizeBody(submission.message)
  const lines = [
    `From: ${sanitizeHeader(config.headerFrom)}`,
    `To: ${sanitizeHeader(config.to)}`,
    `Reply-To: ${email}`,
    `Subject: New portfolio inquiry: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    `Date: ${new Date().toUTCString()}`,
    '',
    'A new portfolio contact form message was submitted.',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Subject: ${subject}`,
    '',
    'Message:',
    textBody,
  ]

  return lines.join('\r\n')
}

export function getMailStatus() {
  const config = getMailConfig()
  return {
    configured: config.ready,
    host: config.host,
    port: config.port,
    secure: config.secure,
    to: config.to,
    missing: config.missing,
  }
}

export async function sendContactEmail(submission) {
  const config = getMailConfig()

  if (!config.ready) {
    throw createConfigError(
      `Email delivery is not configured. Add ${config.missing.join(', ')} to server/.env and restart the server.`,
    )
  }

  const socket = await connectSocket(config)
  const client = createSmtpClient(socket)

  try {
    await expectCode(client, [220], 'SMTP greeting')

    client.send('EHLO localhost')
    await expectCode(client, [250], 'SMTP EHLO')

    client.send('AUTH LOGIN')
    await expectCode(client, [334], 'SMTP auth start')

    client.send(Buffer.from(config.user, 'utf8').toString('base64'))
    await expectCode(client, [334], 'SMTP username')

    client.send(Buffer.from(config.pass, 'utf8').toString('base64'))
    await expectCode(client, [235], 'SMTP password')

    client.send(`MAIL FROM:<${sanitizeHeader(config.envelopeFrom)}>`)
    await expectCode(client, [250], 'SMTP MAIL FROM')

    client.send(`RCPT TO:<${sanitizeHeader(config.to)}>`)
    await expectCode(client, [250, 251], 'SMTP RCPT TO')

    client.send('DATA')
    await expectCode(client, [354], 'SMTP DATA')

    client.sendData(buildEmail(submission, config))
    await expectCode(client, [250], 'SMTP message delivery')

    client.send('QUIT')
    await expectCode(client, [221], 'SMTP QUIT')
  } finally {
    client.close()
  }
}
