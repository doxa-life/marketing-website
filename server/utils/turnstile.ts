export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const config = useRuntimeConfig()
  const secretKey = config.cfTurnstileSecretKey

  if (!secretKey) {
    throw createError({ statusCode: 500, statusMessage: 'Turnstile not configured' })
  }

  const response = await $fetch<{ success: boolean }>('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: {
      secret: secretKey,
      response: token,
      remoteip: remoteIp || '',
    },
  })

  return response.success === true
}
