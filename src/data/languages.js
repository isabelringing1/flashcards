import kr from './kr.json'

const languages = { kr }

export const POS_LABELS = ['noun', 'verb', 'adj.', 'adv.', 'phrase', 'counter']

export function getLanguage(code) {
  return languages[code] || null
}

export function getAvailableLanguages() {
  return Object.values(languages).map(l => ({ code: l.code, language: l.language }))
}

export default languages
