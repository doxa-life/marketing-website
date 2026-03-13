export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  const body = await readBody(event)

  if (!body.title || !body.slug) {
    throw createError({ statusCode: 400, statusMessage: 'Title and slug are required' })
  }

  const page = await createPage({
    slug: body.slug,
    parent_slug: body.parent_slug || null,
    language: body.language || 'en',
    title: body.title,
    content_json: body.content_json || null,
    content_html: body.content_html || null,
    menu_order: body.menu_order || 0,
    featured_image: body.featured_image || null,
    updated_by: null,
  })

  return page
})
