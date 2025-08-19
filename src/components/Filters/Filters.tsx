import './Filters.css'

type FiltersProps = {
  showStarredOnly: boolean
  onToggleShowStarred: () => void
}

export default function Filters({
  showStarredOnly,
  onToggleShowStarred,
}: FiltersProps) {
  return (
    <div className="filters">
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
