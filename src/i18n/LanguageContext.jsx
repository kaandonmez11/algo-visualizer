import { createContext, useContext, useState, useRef } from 'react'
import { translations } from './translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang,   setLangState] = useState('en')
  const [fading, setFading]    = useState(false)
  const timerRef = useRef(null)

  function setLang(newLang) {
    if (newLang === lang) return
    clearTimeout(timerRef.current)

    // Enable transitions AND flip the active language in the SAME render.
    // CSS sees the previous painted opacities (old=1, new=0) and animates
    // them to their new values (old=0, new=1) — a true cross-fade.
    setFading(true)
    setLangState(newLang)

    // After the animation completes, disable transitions so future
    // non-language renders don't accidentally animate.
    timerRef.current = setTimeout(() => setFading(false), 220)
  }

  const t = (key) => translations[lang][key] ?? translations['en'][key] ?? key
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, fading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

// All supported language keys
const LANGS = Object.keys(translations) // ['en', 'tr']

/**
 * <T k="someKey" />
 *
 * ALWAYS renders ALL language variants stacked in the same grid cell
 * so the wrapper is permanently sized to the widest variant — buttons
 * and labels NEVER shift in size or position during a language change.
 *
 * When a language change fires, `fading` enables CSS transitions and
 * `lang` flips simultaneously in a single React render, so the browser
 * cross-fades from the previously painted opacity values to the new ones.
 */
export function T({ k }) {
  const { lang, fading } = useLanguage()

  return (
    <span style={{ display: 'inline-grid', verticalAlign: 'bottom' }}>
      {LANGS.map((l) => {
        const text     = translations[l]?.[k] ?? translations['en']?.[k] ?? k
        const isActive = l === lang

        return (
          <span
            key={l}
            style={{
              gridArea: '1/1',
              whiteSpace: 'nowrap',
              transition: fading ? 'opacity 200ms ease' : 'none',
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? 'auto' : 'none',
              userSelect: isActive ? 'auto' : 'none',
            }}
          >
            {text}
          </span>
        )
      })}
    </span>
  )
}
