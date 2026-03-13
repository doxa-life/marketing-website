export default defineEventHandler(async (event) => {
  const user = requireAuth(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid page ID' })
  }

  const body = await readBody(event)

  const page = await updatePage(id, {
    slug: body.slug,
    parent_slug: body.parent_slug,
    language: body.language,
    title: body.title,
    content_json: body.content_json,
    content_html: body.content_html,
    menu_order: body.menu_order,
    featured_image: body.featured_image,
    updated_by: null,
  })

  if (!page) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }

  return page
})
