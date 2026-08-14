import './Chip.scss'

function Chip({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      className={`chip${active ? ' chip-active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export default Chip
