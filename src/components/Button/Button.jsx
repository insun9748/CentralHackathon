import './Button.scss'

function Button({ children, icon, onClick, variant = 'primary', type = 'button', className = '' }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`.trim()}
      onClick={onClick}
    >
      {icon && <img className="btn-icon" src={icon} alt="" />}
      <span className="btn-label">{children}</span>
    </button>
  )
}

export default Button
