import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import enResources from '@/locales/en.json'
import jaResources from '@/locales/ja.json'
import zhHansResources from '@/locales/zh-Hans.json'
export const SUPPORTED_LANGUAGES = [
  {
    value: 'zh-Hans',
    label: '简体中文',
  },
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'ja',
    label: '日本語',
  },
] as const

const resources = {
  en: {
    translation: enResources,
  },
  'zh-Hans': {
    translation: zhHansResources,
  },
  ja: {
    translation: jaResources,
  },
}

void i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    supportedLngs: SUPPORTED_LANGUAGES.map((lang) => lang.value),

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    detection: {
      order: ['querystring', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
    },
  })

export default i18n
