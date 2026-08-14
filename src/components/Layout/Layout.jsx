import { Outlet } from 'react-router-dom'
import BottomNav from '../BottomNav/BottomNav.jsx'

function Layout() {
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}

export default Layout
