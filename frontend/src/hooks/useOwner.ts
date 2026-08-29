import { useQuery } from '@tanstack/react-query'
import { companyApi } from '@/services/companyApi'

// BACKEND GAP: This hook depends on GET /owner/companies
export function useOwnerCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: companyApi.getOwnerCompanies,
    staleTime: 5 * 60 * 1000,
  })
}