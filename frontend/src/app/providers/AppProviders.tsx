import { useMemo } from 'react'
import { AuthContext } from '@/features/auth/AuthContext'
import { useOwnerAuth } from '@/features/auth/OwnerAuthProvider'
import { useCompanyAuth } from '@/features/auth/CompanyAuthProvider'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const ownerAuth = useOwnerAuth()
  const companyAuth = useCompanyAuth()

  const value = useMemo(
    () => ({
      owner: ownerAuth.owner,
      company: companyAuth.company,
      loginOwner: ownerAuth.loginOwner,
      logoutOwner: ownerAuth.logoutOwner,
      loginCompany: companyAuth.loginCompany,
      logoutCompany: companyAuth.logoutCompany,
    }),
    [ownerAuth, companyAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}