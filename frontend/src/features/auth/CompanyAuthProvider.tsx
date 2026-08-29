import { useState, useCallback } from 'react'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Company } from '@/types/auth'
import type { CompanyAuthState } from './AuthContext'

export function useCompanyAuth() {
  const [company, setCompany] = useState<CompanyAuthState>(() => {
    const token = localStorage.getItem(STORAGE_KEYS.COMPANY_TOKEN)
    const companyStr = localStorage.getItem(STORAGE_KEYS.COMPANY_DATA)
    const companyData = companyStr ? (JSON.parse(companyStr) as Company) : null
    
    return {
      isAuthenticated: !!token && !!companyData,
      token,
      company: companyData,
    }
  })

  const loginCompany = useCallback((token: string, companyData: Company) => {
    localStorage.setItem(STORAGE_KEYS.COMPANY_TOKEN, token)
    localStorage.setItem(STORAGE_KEYS.COMPANY_DATA, JSON.stringify(companyData))
    setCompany({ isAuthenticated: true, token, company: companyData })
  }, [])

  const logoutCompany = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.COMPANY_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.COMPANY_DATA)
    setCompany({ isAuthenticated: false, token: null, company: null })
  }, [])

  return { company, loginCompany, logoutCompany }
}


