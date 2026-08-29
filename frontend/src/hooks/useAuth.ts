import { useAuthContext } from '@/features/auth/useAuthContext'

export function useAuth() {
  return useAuthContext()
}

export function useOwner() {
  const { owner } = useAuthContext()
  return owner
}

export function useCompany() {
  const { company } = useAuthContext()
  return company
}