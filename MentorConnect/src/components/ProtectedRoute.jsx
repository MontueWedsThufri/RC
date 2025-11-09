import { Navigate } from 'react-router-dom'
import { useApp } from '../state/AppContext'

export default function ProtectedRoute({ children }) {
  const { user } = useApp()
  
  if (!user) {
    // Redirect to landing page, which has login options
    return <Navigate to="/" replace />
  }
  
  return children
}
