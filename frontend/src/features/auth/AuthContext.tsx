import { createContext, useContext } from 'react' // 1. Added useContext here
import type { Owner, Company } from '@/types/auth'

export interface OwnerAuthState {
  isAuthenticated: boolean
  token: string | null
  user: Owner | null
}

export interface CompanyAuthState {
  isAuthenticated: boolean
  token: string | null
  company: Company | null
}

export interface AuthContextType {
  owner: OwnerAuthState
  company: CompanyAuthState
  loginOwner: (token: string, user: Owner) => void
  logoutOwner: () => void
  loginCompany: (token: string, company: Company) => void
  logoutCompany: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 2. Add and export the missing custom hook below
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



