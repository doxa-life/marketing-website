import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

export default defineNitroPlugin(async () => {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) return

  try {
    const existing = await sql`SELECT id FROM users LIMIT 1`
    if (existing.length > 0) return

    const id = randomUUID()
    const tokenKey = randomUUID()
    const now = new Date().toISOString()
    const hash = await bcrypt.hash(password, 12)

    await sql`
      INSERT INTO users (id, created, updated, email, password, verified, superadmin, display_name, avatar, token_key, email_visibility)
      VALUES (${id}, ${now}, ${now}, ${email}, ${hash}, true, true, 'Admin', '', ${tokenKey}, false)
    `

    console.log(`✅ Admin user seeded: ${email}`)
  } catch (e: any) {
    if (e.code !== '42P01') { // ignore "table doesn't exist" during first run
      console.error('Admin seed error:', e.message)
    }
  }
})
