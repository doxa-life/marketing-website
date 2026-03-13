export async function getAllPages(language?: string) {
  if (language) {
    return await sql`
      SELECT * FROM pages
      WHERE language = ${language}
      ORDER BY menu_order ASC, title ASC
    `
  }
  return await sql`
    SELECT * FROM pages
    ORDER BY language ASC, menu_order ASC, title ASC
  `
}

export async function getPageBySlug(slug: string, language: string) {
  const rows = await sql`
    SELECT * FROM pages
    WHERE slug = ${slug} AND language = ${language}
    LIMIT 1
  `
  return rows[0] || null
}

export async function getChildPages(parentSlug: string, language: string) {
  return await sql`
    SELECT * FROM pages
    WHERE parent_slug = ${parentSlug} AND language = ${language}
    ORDER BY menu_order ASC, title ASC
  `
}

export async function createPage(data: {
  slug: string
  parent_slug?: string | null
  language?: string
  title: string
  content_json?: any
  content_html?: string
  menu_order?: number
  featured_image?: string | null
  updated_by?: number | null
}) {
  const rows = await sql`
    INSERT INTO pages (
      slug, parent_slug, language, title,
      content_json, content_html, menu_order,
      featured_image, updated_by
    ) VALUES (
      ${data.slug},
      ${data.parent_slug || null},
      ${data.language || 'en'},
      ${data.title},
      ${data.content_json ? (typeof data.content_json === 'string' ? data.content_json : JSON.stringify(data.content_json)) : null},
      ${data.content_html || null},
      ${data.menu_order || 0},
      ${data.featured_image || null},
      ${data.updated_by || null}
    )
    RETURNING *
  `
  return rows[0]
}

export async function updatePage(id: number, data: {
  slug?: string
  parent_slug?: string | null
  language?: string
  title?: string
  content_json?: any
  content_html?: string | null
  menu_order?: number
  featured_image?: string | null
  updated_by?: number | null
}) {
  const existing = await sql`SELECT * FROM pages WHERE id = ${id} LIMIT 1`
  if (!existing[0]) return null

  const current = existing[0] as any

  const rows = await sql`
    UPDATE pages SET
      slug = ${data.slug ?? current.slug},
      parent_slug = ${data.parent_slug !== undefined ? data.parent_slug : current.parent_slug},
      language = ${data.language ?? current.language},
      title = ${data.title ?? current.title},
      content_json = ${data.content_json ? (typeof data.content_json === 'string' ? data.content_json : JSON.stringify(data.content_json)) : current.content_json},
      content_html = ${data.content_html !== undefined ? data.content_html : current.content_html},
      menu_order = ${data.menu_order ?? current.menu_order},
      featured_image = ${data.featured_image !== undefined ? data.featured_image : current.featured_image},
      updated_by = ${data.updated_by ?? current.updated_by},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0] || null
}

export async function deletePage(id: number) {
  const rows = await sql`
    DELETE FROM pages WHERE id = ${id} RETURNING *
  `
  return rows[0] || null
}
