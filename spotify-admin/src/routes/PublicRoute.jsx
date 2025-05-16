import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {
  const token = localStorage.getItem('access_token')
  return !!token
}

const PublicRoute = () => {
  const isAuth = useAuth()
  // Nếu đã login rồi, redirect thẳng vào dashboard
  return <Outlet />
}

export default PublicRoute
