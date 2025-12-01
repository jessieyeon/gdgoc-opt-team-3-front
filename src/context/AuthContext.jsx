import { createContext, useContext, useEffect, useState } from 'react'
import { getStoredToken, setStoredToken } from '@/services/api'

const AuthContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  logout: () => {},
})

const STORAGE_KEY = 'yonsei-notes-auth'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => readStoredUser())
  const [token, setTokenState] = useState(() => getStoredToken())

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('Failed to save user to localStorage:', error)
    }
  }, [user])

  const setUser = (userData) => {
    setUserState(userData)
  }

  const setToken = (newToken) => {
    setTokenState(newToken)
    setStoredToken(newToken)
  }

  const logout = () => {
    setUserState(null)
    setTokenState(null)
    setStoredToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

