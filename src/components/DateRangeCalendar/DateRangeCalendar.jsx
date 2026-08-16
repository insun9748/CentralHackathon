import { useState } from 'react'
import prevIcon from '../../assets/tracker/img/tracker_left.svg'
import nextIcon from '../../assets/tracker/img/tracker_right.svg'
import './DateRangeCalendar.scss'

function isSameDay(a, b) {
  return Boolean(a) && Boolean(b) && a.getTime() === b.getTime()
}

function buildCalendarDays(year, month) {
  const firstDayIndex = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDayIndex; i++) days.push(null)
  for (let d = 1; d <= lastDate; d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)
  return days
}

function DateRangeCalendar({ start, end, onSelectDay, onConfirm }) {
  const initial = start ?? new Date()
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const calendarDays = buildCalendarDays(viewYear, viewMonth)
  const weeks = []
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7))
  }

  const handlePrevMonth = () => {
    const d = new Date(viewYear, viewMonth - 1, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const handleNextMonth = () => {
    const d = new Date(viewYear, viewMonth + 1, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  return (
    <div className="date-range-calendar">
      <div className="date-range-calendar-nav">
        <button type="button" className="date-range-calendar-nav-btn" onClick={handlePrevMonth} aria-label="이전 달">
          <img src={prevIcon} alt="" />
        </button>
        <span className="date-range-calendar-nav-label">{viewYear}년 {viewMonth + 1}월</span>
        <button type="button" className="date-range-calendar-nav-btn" onClick={handleNextMonth} aria-label="다음 달">
          <img src={nextIcon} alt="" />
        </button>
      </div>

      <div className="date-range-calendar-grid">
        {weeks.map((week, rowIndex) => {
          let bandStartCol = null
          let bandEndCol = null

          if (start && end) {
            week.forEach((day, col) => {
              if (day == null) return
              const cellDate = new Date(viewYear, viewMonth, day)
              if (cellDate >= start && cellDate <= end) {
                if (bandStartCol === null) bandStartCol = col
                bandEndCol = col
              }
            })
          }

          return (
            <div key={rowIndex} className="date-range-calendar-row">
              {bandStartCol !== null && (
                <span
                  className="date-range-calendar-band"
                  style={{
                    left: `${(bandStartCol / 7) * 100}%`,
                    width: `${((bandEndCol - bandStartCol + 1) / 7) * 100}%`,
                  }}
                />
              )}
              {week.map((day, col) => {
                if (day == null) {
                  return <span key={col} className="date-range-calendar-cell date-range-calendar-cell-empty" />
                }

                const cellDate = new Date(viewYear, viewMonth, day)
                const isEdge = isSameDay(cellDate, start) || isSameDay(cellDate, end)

                return (
                  <button
                    key={col}
                    type="button"
                    className="date-range-calendar-cell"
                    onClick={() => onSelectDay(cellDate)}
                  >
                    {isEdge && <span className="date-range-calendar-marker" />}
                    <span className="date-range-calendar-day-num">{day}</span>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      <button type="button" className="date-range-calendar-confirm" onClick={onConfirm}>
        선택완료
      </button>
    </div>
  )
}

export default DateRangeCalendar
