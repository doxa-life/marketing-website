// Single source of truth for language configuration
// Used by both nuxt.config.ts (i18n) and app/server code

export interface Language {
  code: string
  name: string           // English name
  nativeName: string     // Name in the language itself
  flag: string
  dir?: 'ltr' | 'rtl'    // Text direction (defaults to 'ltr')
  enabled?: boolean      // Whether the language is active in the UI (default: true)
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', enabled: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', enabled: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', enabled: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', enabled: false },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', enabled: false },
]

// All language codes
export const LANGUAGE_CODES = LANGUAGES.map(lang => lang.code)

// Enabled languages — used for front-end language switcher and i18n locales
export const ENABLED_LANGUAGES = LANGUAGES.filter(lang => lang.enabled !== false)
export const ENABLED_LANGUAGE_CODES = ENABLED_LANGUAGES.map(lang => lang.code)

// Generate i18n locale config from enabled languages only
export function generateI18nLocales() {
  return ENABLED_LANGUAGES.map(lang => ({
    code: lang.code,
    name: lang.nativeName,
    ...(lang.dir && { dir: lang.dir }),
    files: [`${lang.code}/common.json`]
  }))
}
