export default defineEventHandler(async (event) => {
  requireAuth(event)

  const query = getQuery(event)
  const language = query.language as string | undefined

  const pages = await getAllPages(language)
  return pages
})
