export const fallbackLng = 'en'
export const languages = ['en', 'ar']
export const defaultNS = 'translation'

export function getOptions(lng = fallbackLng) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns: [defaultNS],
  }
} 