export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const {
    first_name, last_name, email, phone,
    church_name, country, role,
    confirm_adoption, permission_to_contact, confirm_public_display,
    people_group, language, cf_turnstile,
  } = body

  if (!email || !first_name || !last_name) {
    throw createError({ statusCode: 400, statusMessage: 'Name and email are required' })
  }
  if (!confirm_adoption) {
    throw createError({ statusCode: 400, statusMessage: 'Please confirm your adoption commitment' })
  }

  const ip = getRequestIP(event) || ''
  const verified = await verifyTurnstile(cf_turnstile, ip)
  if (!verified) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid CAPTCHA' })
  }

  const apiUrl = config.campaignsServerUrl
  const apiKey = config.formApiKey

  if (!apiUrl || !apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Adoption service not configured' })
  }

  try {
    const response = await $fetch<any>(`${apiUrl}/api/adopt`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: {
        first_name,
        last_name,
        email,
        phone,
        role,
        church_name,
        country,
        people_group,
        permission_to_contact: permission_to_contact === true,
        confirm_public_display: confirm_public_display === true,
        language: language || 'en',
      },
    })

    if (response.needs_verification) {
      return { status: 'needs_verification' }
    }

    return { status: 'success' }
  } catch (error: any) {
    console.error('Adoption API error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'Failed to submit adoption. Please try again.',
    })
  }
})
