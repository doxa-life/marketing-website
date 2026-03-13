export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  const query = getQuery(event)
  const language = (query.language as string) || 'en'

  const page = await getPageBySlug(slug, language)

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  const siblings = page.parent_slug
    ? await getChildPages(page.parent_slug, language)
    : await getChildPages(slug, language)

  let parent = null
  if (page.parent_slug) {
    parent = await getPageBySlug(page.parent_slug, language)
  }

  return {
    page,
    siblings,
    parent,
  }
})
