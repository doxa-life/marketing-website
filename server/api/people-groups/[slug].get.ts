export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  try {
    const data = await $fetch(`https://pray.doxa.life/api/people-groups/${slug}`)
    return data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 404,
      statusMessage: 'People group not found',
    })
  }
})
