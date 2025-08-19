import { LANGUAGE_OPTIONS } from '../../constants/languages'
import './Filters.css'

type FiltersProps = {
  showStarredOnly: boolean
  onToggleShowStarred: () => void
  selectedLanguage: string
  onLanguageChange: (lang: string) => void
}

export default function Filters({
  showStarredOnly,
  onToggleShowStarred,
  selectedLanguage,
  onLanguageChange,
}: FiltersProps) {
  return (
    <div className="filters">
      <div className="filters__group">
        <label className="filters__label" htmlFor="filters-language">
          Language
        </label>
        <select
          id="filters-language"
          className="filters__select"
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          <option value="">All</option>
          {LANGUAGE_OPTIONS.map((lang: string, idx: number) => (
            <option key={`${lang}-${idx}`} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="filters__group filters__group--inline">
        <label className="filters__checkbox">
          <input
            type="checkbox"
            className="filters__checkbox-input"
            checked={showStarredOnly}
            onChange={onToggleShowStarred}
          />
          <span className="filters__checkbox-text">Show only starred</span>
        </label>
      </div>
    </div>
  )
}
