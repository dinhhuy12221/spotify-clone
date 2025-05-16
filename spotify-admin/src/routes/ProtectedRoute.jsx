import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// Kiểm tra xem đã có token chưa
const useAuth = () => {
  const token = localStorage.getItem('access_token')
  return !!token
}

const ProtectedRoute = () => {
  const isAuth = useAuth()
  return isAuth ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
