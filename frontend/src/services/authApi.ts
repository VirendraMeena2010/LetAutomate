import { apiClient } from './api'
import type {
  OwnerLoginRequest,
  OwnerLoginResponse,
  OwnerRegisterRequest,
  CompanyLoginRequest,
  CompanyLoginResponse,
  CompanyRegisterRequest,
} from '@/types/auth'

export const authApi = {
  // Owner authentication
  registerOwner: (data: OwnerRegisterRequest) =>
    apiClient.post<OwnerLoginResponse>('/create_owner', data).then((res) => res.data),

  loginOwner: (data: OwnerLoginRequest) =>
    apiClient.post<OwnerLoginResponse>('/login_owner', data).then((res) => res.data),

  // Company authentication
  registerCompany: (data: CompanyRegisterRequest) =>
    apiClient.post<CompanyLoginResponse>('/register', data).then((res) => res.data),

  loginCompany: (data: CompanyLoginRequest) =>
    apiClient.post<CompanyLoginResponse>('/login', data).then((res) => res.data),
}