import { NavLink } from 'react-router-dom'
import { navItems } from './navItems'
import './BottomNav.scss'

function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) => `bottom-nav-item${isActive ? ' bottom-nav-item-active' : ''}`}
        >
          <img className="bottom-nav-icon" src={item.icon} alt="" />
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
