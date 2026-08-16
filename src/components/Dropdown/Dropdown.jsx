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

  if (!open) {
    return (
      <div className={`dropdown ${className}`.trim()}>
        <button type="button" className="dropdown-trigger" onClick={() => setOpen(true)}>
          <span className="dropdown-trigger-label">{selected?.label}</span>
          <img className="dropdown-trigger-icon" src={chevronIcon} alt="" />
        </button>
      </div>
    )
  }

  // 열렸을 때는 트리거와 옵션 목록이 하나로 이어진 패널로 보여야 하므로,
  // 별도의 트리거 버튼을 두지 않고 첫 번째 옵션 행에 화살표만 같이 그림
  return (
    <div className={`dropdown ${className}`.trim()}>
      <div className="dropdown-panel">
        {options.map((option, index) => (
          <button
            key={option.id}
            type="button"
            className={`dropdown-option${option.id === value ? ' dropdown-option-selected' : ''}`}
            onClick={() => handleSelect(option.id)}
          >
            {option.label}
            {index === 0 && <img className="dropdown-option-chevron" src={chevronIcon} alt="" />}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Dropdown
