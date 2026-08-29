import { useQuery } from '@tanstack/react-query'
import { companyApi } from '@/services/companyApi'

// BACKEND GAP: This hook depends on GET /company/:id
export function useCompany(companyId: string) {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => companyApi.getCompany(companyId),
    enabled: !!companyId,
    staleTime: 5 * 60 * 1000,
  })
}