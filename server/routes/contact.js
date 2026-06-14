import { Router } from 'express'
import Contact from '../models/Contact.js'
import { getMailStatus, sendContactEmail } from '../lib/smtpMailer.js'

const router = Router()
const memoryContacts = []
const submissionWindowMs = 10 * 60 * 1000
const maxSubmissionsPerWindow = 8
const submissionCounts = new Map()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fieldRules = {
  name: { min: 2, max: 80, label: 'name' },
  email: { max: 120, label: 'email address' },
  subject: { min: 3, max: 140, label: 'subject' },
  message: { min: 10, max: 2000, label: 'message' },
}

function buildFallbackMailto(submission, to) {
  const subject = `Portfolio inquiry: ${submission.subject}`
  const body = [
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    '',
    submission.message,
  ].join('\n')

  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function limitContactSubmissions(req, res, next) {
  const now = Date.now()
  const key = String(req.ip || 'unknown')
  const entry = submissionCounts.get(key)

  if (!entry || entry.resetAt <= now) {
    submissionCounts.set(key, { count: 1, resetAt: now + submissionWindowMs })
    next()
    return
  }

  if (entry.count >= maxSubmissionsPerWindow) {
    res.setHeader('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)))
    res.status(429).json({ message: 'Too many messages were sent from this connection. Please wait a few minutes and try again.' })
    return
  }

  entry.count += 1
  next()
}

router.post('/', limitContactSubmissions, async (req, res) => {
  const website = String(req.body.website || '').trim()

  if (website) {
    return res.status(204).end()
  }

  const fields = Object.keys(fieldRules)
  const submission = Object.fromEntries(
    fields.map((field) => [field, String(req.body[field] || '').trim()]),
  )
  submission.email = submission.email.toLowerCase()

  if (fields.some((field) => !submission[field])) {
    return res.status(400).json({ message: 'Please complete every field.' })
  }

  for (const field of fields) {
    const { label, min, max } = fieldRules[field]
    if (min && submission[field].length < min) {
      return res.status(400).json({ message: `Please enter a longer ${label}.` })
    }
    if (max && submission[field].length > max) {
      return res.status(400).json({ message: `Please shorten the ${label}.` })
    }
  }

  if (!emailPattern.test(submission.email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' })
  }

  try {
    if (req.app.locals.mongoConnected) {
      await Contact.create(submission)
    } else {
      memoryContacts.push({ ...submission, createdAt: new Date().toISOString() })
    }
  } catch (error) {
    console.error('Contact save failed:', error.message)
    return res.status(500).json({ message: 'Your message could not be saved. Please try again.' })
  }

  try {
    await sendContactEmail(submission)
    return res.status(201).json({ message: 'Thank you. Your message has been sent successfully.' })
  } catch (error) {
    console.error('Contact email failed:', error.message)
    if (error.code === 'EMAIL_NOT_CONFIGURED') {
      const mail = getMailStatus()
      return res.status(202).json({
        message:
          'Your message was saved, but direct email delivery is not active on this environment yet. Use the email fallback button below.',
        delivery: 'fallback',
        fallbackMailto: buildFallbackMailto(submission, mail.to),
      })
    }

    return res.status(502).json({
      message: 'Your message was saved, but email delivery failed. Please check the mail settings and try again.',
    })
  }
})

router.get('/status', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(404).json({ message: 'Not found.' })
    return
  }

  res.json({
    storage: req.app.locals.mongoConnected ? 'mongodb' : 'memory',
    submissions: req.app.locals.mongoConnected ? undefined : memoryContacts.length,
    mail: getMailStatus(),
  })
})

export default router
