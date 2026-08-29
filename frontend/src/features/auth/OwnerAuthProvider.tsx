import { useState, useCallback } from 'react'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Owner } from '@/types/auth'
import type { OwnerAuthState } from './AuthContext'

export function useOwnerAuth() {
  const [owner, setOwner] = useState<OwnerAuthState>(() => {
    const token = localStorage.getItem(STORAGE_KEYS.OWNER_TOKEN)
    const userStr = localStorage.getItem(STORAGE_KEYS.OWNER_USER)
    const user = userStr ? (JSON.parse(userStr) as Owner) : null
    
    return {
      isAuthenticated: !!token && !!user,
      token,
      user,
    }
  })

  const loginOwner = useCallback((token: string, user: Owner) => {
    localStorage.setItem(STORAGE_KEYS.OWNER_TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.OWNER_USER, JSON.stringify(user))
    setOwner({ isAuthenticated: true, token, user })
  }, [])

  const logoutOwner = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.OWNER_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.OWNER_USER)
    setOwner({ isAuthenticated: false, token: null, user: null })
  }, [])

  return { owner, loginOwner, logoutOwner }
}


