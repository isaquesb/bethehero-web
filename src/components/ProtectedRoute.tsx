import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/" replace />
  return <>{children}</>
}
