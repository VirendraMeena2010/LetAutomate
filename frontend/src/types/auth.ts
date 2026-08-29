export interface Owner {
  full_name: string
  email: string
  user_id: string
  account_status: string
  email_verification_status: string
  created_at: string
  updated_at: string
  last_login: string
}

export interface OwnerLoginRequest {
  email: string
  password: string
}

export interface OwnerLoginResponse {
  access_token: string
  token_type: string
  user: Owner
}

export interface OwnerRegisterRequest {
  full_name: string
  email: string
  password: string
}

export interface CompanyLoginRequest {
  company_email: string
  company_password: string
}

export interface Company {
  company_id: string
  owner_id: string
  company_email: string
  company_name: string
  industry: string
  company_website: string
  country: string
  linkedin_company_page?: string
  services_description?: string
  target_industries?: string
  preferred_company_size?: string
  brand_voice?: string
  default_cta?: string
  email_signature?: string
  preferred_tone?: string
  subscription_plan?: string
  account_status?: string
  created_at?: string
  updated_at?: string
}

export interface CompanyLoginResponse {
  access_token: string
  token_type: string
  company: Company
}

export interface CompanyRegisterRequest {
  company_email: string
  company_name: string
  industry: string
  company_website: string
  country: string
  linkedin_company_page?: string
  services_description?: string
  target_industries: string[];
  preferred_company_size?: string
  brand_voice?: string
  default_cta?: string
  email_signature?: string
  preferred_tone?: string
  owner_id?: string
  company_password: string
}