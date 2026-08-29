import type { Company } from './auth'

export interface CompanyFormData {
  companyName: string
  companyEmail: string
  industry: string
  website: string
  country: string
  linkedinPage: string
  servicesDescription: string
  targetIndustries: string
  preferredCompanySize: string
  brandVoice: string
  defaultCta: string
  emailSignature: string
  preferredTone: string
  password: string
  confirmPassword: string
}

// BACKEND GAP: No GET endpoint for owner companies yet
export interface CompanyListResponse {
  companies: Company[]
}