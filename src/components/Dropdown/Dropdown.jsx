import { useState } from 'react'
import chevronIcon from '../../assets/Report/img/chevron-down.svg'
import './Dropdown.scss'

function Dropdown({ options, value, onChange, className = '' }) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.id === value)

  const handleSelect = (id) => {
    onChange(id)
    setOpen(false)
  }

  return (
    <div className={`dropdown ${className}`.trim()}>
      <button
        type="button"
        className={`dropdown-trigger${open ? ' dropdown-trigger-open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="dropdown-trigger-label">{selected?.label}</span>
        <img className="dropdown-trigger-icon" src={chevronIcon} alt="" />
      </button>

      {open && (
        <div className="dropdown-panel">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`dropdown-option${option.id === value ? ' dropdown-option-selected' : ''}`}
              onClick={() => handleSelect(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
