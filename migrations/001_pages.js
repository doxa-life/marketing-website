class BaseMigration {
  async exec(sql, query) {
    await sql.unsafe(query)
  }

  async tableExists(sql, tableName) {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
      ) as exists
    `
    return result[0]?.exists || false
  }
}

export default class PagesMigration extends BaseMigration {
  id = 1
  name = 'Create pages table'

  async up(sql) {
    const exists = await this.tableExists(sql, 'pages')
    if (exists) {
      console.log('Pages table already exists, skipping')
      return
    }

    console.log('🔄 Creating pages table...')
    await sql`CREATE TABLE pages (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL,
      parent_slug TEXT,
      language TEXT NOT NULL DEFAULT 'en',
      title TEXT NOT NULL,
      content_json JSONB,
      content_html TEXT,
      menu_order INTEGER DEFAULT 0,
      featured_image TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      updated_by UUID REFERENCES users(id),
      UNIQUE(slug, language)
    )`
    console.log('✅ Pages table created successfully!')

    console.log('🔄 Creating indexes...')
    await sql`CREATE INDEX idx_pages_slug ON pages(slug)`
    await sql`CREATE INDEX idx_pages_parent_slug ON pages(parent_slug)`
    await sql`CREATE INDEX idx_pages_language ON pages(language)`
    console.log('✅ Indexes created successfully!')
  }
}
