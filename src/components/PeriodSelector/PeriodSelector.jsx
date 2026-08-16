import { useState } from 'react'
import Dropdown from '../Dropdown/Dropdown.jsx'
import DateRangeCalendar from '../DateRangeCalendar/DateRangeCalendar.jsx'
import chevronIcon from '../../assets/Report/img/chevron-down.svg'
import calendarIcon from '../../assets/Report/img/calendar-icon.svg'
import './PeriodSelector.scss'

const CUSTOM_OPTION_ID = 'custom'

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

function PeriodSelector({ options, value, onChange, className = '' }) {
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [customRange, setCustomRange] = useState({ start: null, end: null })

  const isCustom = value === CUSTOM_OPTION_ID

  const handleOptionChange = (id) => {
    onChange(id)
    if (id === CUSTOM_OPTION_ID) {
      setCalendarOpen(true)
    }
  }

  const handleSelectDay = (date) => {
    setCustomRange((prev) => {
      if (!prev.start || prev.end) return { start: date, end: null }
      if (date < prev.start) return { start: date, end: null }
      return { start: prev.start, end: date }
    })
  }

  const handleConfirm = () => {
    setCustomRange((prev) => (prev.start ? { start: prev.start, end: prev.end ?? prev.start } : prev))
    setCalendarOpen(false)
  }

  if (!isCustom) {
    return <Dropdown options={options} value={value} onChange={handleOptionChange} className={className} />
  }

  const rangeLabel =
    customRange.start && customRange.end
      ? `${formatDate(customRange.start)}-${formatDate(customRange.end)}`
      : customRange.start
        ? `${formatDate(customRange.start)}-`
        : '기간을 선택하세요'

  return (
    <div className={`period-selector ${className}`.trim()}>
      <button
        type="button"
        className={`period-selector-trigger${calendarOpen ? ' period-selector-trigger-open' : ''}`}
        onClick={() => setCalendarOpen((prev) => !prev)}
      >
        <span className="period-selector-trigger-content">
          <img className="period-selector-calendar-icon" src={calendarIcon} alt="" />
          <span className="period-selector-trigger-label">{rangeLabel}</span>
        </span>
        <img
          className={`period-selector-chevron${calendarOpen ? ' period-selector-chevron-open' : ''}`}
          src={chevronIcon}
          alt=""
        />
      </button>

      {calendarOpen && (
        <DateRangeCalendar
          start={customRange.start}
          end={customRange.end}
          onSelectDay={handleSelectDay}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

export default PeriodSelector
