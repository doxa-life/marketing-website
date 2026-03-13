import en from './i18n/locales/en/common.json'

export default defineI18nConfig(() => ({
  legacy: false,
  fallbackLocale: 'en',
  messages: { en }
}))
