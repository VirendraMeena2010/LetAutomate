import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/services/authApi'
import type { CompanyRegisterRequest, CompanyLoginResponse } from '@/types/auth'

export function useCompanyRegister() {
  return useMutation<CompanyLoginResponse, Error, CompanyRegisterRequest>({
    mutationFn: authApi.registerCompany,
  })
}