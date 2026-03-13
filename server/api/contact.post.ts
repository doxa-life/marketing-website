export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, message, cf_turnstile } = body

  if (!email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Email and message are required' })
  }

  const ip = getRequestIP(event) || ''
  const verified = await verifyTurnstile(cf_turnstile, ip)
  if (!verified) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid CAPTCHA' })
  }

  // TODO: Forward to CRM (Disciple Tools) — replaces WordPress Site Link System integration
  console.log('Contact form submission:', { name, email, message })

  return 'success'
})
