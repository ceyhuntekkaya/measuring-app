// next-i18next.config.ts
export const i18n = {
    defaultLocale: 'tr',
    locales: ['tr', 'en', 'de'],
    // localeDetection yok
}

const NextI18NextConfig = {
    i18n,
    reloadOnPrerender: process.env.NODE_ENV === 'development',
}

export default NextI18NextConfig