import { Navigate, Outlet } from 'react-router-dom'
import { isLoggedIn } from '../../api/tokenStorage.js'

function RequireAuth() {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

export default RequireAuth
