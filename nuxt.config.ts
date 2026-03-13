// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { extname } from 'node:path'
import { generateI18nLocales } from './config/languages'

const appTitle = process.env.APP_TITLE || 'DOXA'
const baseLayerUrl = process.env.BASE_LAYER_URL || 'github:corsacca/nuxt-base#master'

export default defineNuxtConfig({
  extends: [baseLayerUrl],

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  devServer: { port: 3200 },

  css: ['~/assets/styles/main.scss'],

  app: {
    head: {
      title: appTitle,
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'stylesheet', href: '/fonts/BebasNeue/stylesheet.css' },
        { rel: 'stylesheet', href: '/fonts/Brandon_Grotesque/stylesheet.css' },
        { rel: 'stylesheet', href: '/fonts/Poppins/stylesheet.css' },
        { rel: 'stylesheet', href: '/fonts/BebasKai/stylesheet.css' }
      ]
    }
  },

  components: [
    { path: '~/components', pathPrefix: false }
  ],

  modules: ['@nuxtjs/i18n', '@nuxt/icon', '@nuxt/ui'],

  i18n: {
    locales: generateI18nLocales(),
    defaultLocale: 'en',
    langDir: 'locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'preferred_language',
      redirectOn: 'root',
      alwaysRedirect: true
    },
    bundle: {
      optimizeTranslationDirective: false
    },
    vueI18n: './i18n.config.ts'
  },

  alias: {
    '#server': fileURLToPath(new URL('./server', import.meta.url))
  },

  routeRules: {
    '/en/**': { redirect: '/**' },
    '/admin/**': { ssr: false },
    '/': { isr: 3600 },
    '/pray': { isr: 3600 },
    '/adopt': { isr: 3600 },
    '/about/**': { isr: 3600 },
    '/contact-us': { isr: 3600 },
    '/privacy-policy': { isr: 3600 },
    '/wp-content/**': { redirect: '/' },
    '/wp-admin/**': { redirect: '/admin' },
    '/wp-login.php': { redirect: '/login' },
  },

  nitro: {
    imports: {
      exclude: [
        '**/server/utils/app/**'
      ]
    },
    rollupConfig: {
      plugins: [
        {
          name: 'resolve-base-layer-ts',
          resolveId(source: string) {
            if (source.includes('.c12') && !extname(source)) {
              const tsPath = source + '.ts'
              if (existsSync(tsPath)) return tsPath
            }
            return null
          }
        }
      ]
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  },

  runtimeConfig: {
    appName: appTitle,
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL || '',

    smtpHost: process.env.SMTP_HOST || 'localhost',
    smtpPort: process.env.SMTP_PORT || '1025',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM || 'noreply@localhost.com',
    smtpSecure: process.env.SMTP_SECURE || 'false',
    smtpRejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED || 'true',

    s3Endpoint: process.env.S3_ENDPOINT || '',
    s3Region: process.env.S3_REGION || '',
    s3AccessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    s3BucketName: process.env.S3_BUCKET_NAME || '',

    mapboxToken: process.env.MAPBOX_TOKEN || '',
    cfTurnstileSiteKey: process.env.CF_TURNSTILE_SITE_KEY || '',
    cfTurnstileSecretKey: process.env.CF_TURNSTILE_SECRET_KEY || '',
    campaignsServerUrl: process.env.CAMPAIGNS_SERVER_URL || 'https://pray.doxa.life',
    formApiKey: process.env.FORM_API_KEY || '',

    public: {
      appName: appTitle,
      nodeEnv: process.env.NODE_ENV || 'development',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      mapboxToken: process.env.MAPBOX_TOKEN || '',
      cfTurnstileSiteKey: process.env.CF_TURNSTILE_SITE_KEY || ''
    }
  }
})
