import { useLanguage } from './LanguageContext'

export function T({ k }) {
  const { t, fading } = useLanguage()
  return (
    <span className={`transition-opacity duration-150 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      {t(k)}
    </span>
  )
}
