import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function parseToken(token) {
  try {
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (payload.exp * 1000 < Date.now()) return null
    return { id: payload.id, username: payload.username, role: payload.role }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => parseToken(localStorage.getItem('gaeco-token')))

  function login(token, userData) {
    localStorage.setItem('gaeco-token', token)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('gaeco-token')
    setUser(null)
  }

  function getToken() {
    return localStorage.getItem('gaeco-token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
