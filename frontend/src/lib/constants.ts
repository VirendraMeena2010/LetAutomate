export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"

export const ROUTES = {
  // ==========================================================
  // PUBLIC ROUTES
  // ==========================================================

  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  GUEST_RESEARCH: "/guest-research",

  // ==========================================================
  // OWNER ROUTES
  // ==========================================================

  APP: "/app",

  COMPANIES: "/app/companies",

  CREATE_COMPANY:
    "/app/companies/new",

  // ==========================================================
  // COMPANY ROUTES
  // ==========================================================

  COMPANY_DASHBOARD:
    "/app/company/:companyId",

  NEW_RESEARCH:
    "/app/company/:companyId/research/new",

  RESEARCH_RESULT:
    "/app/company/:companyId/research/:researchId",

  // ==========================================================
  // FUTURE ROUTES
  // ==========================================================

  // RESEARCH_HISTORY:
  //   "/app/company/:companyId/research",

  // COMPANY_SETTINGS:
  //   "/app/company/:companyId/settings",

  // OUTREACH:
  //   "/app/company/:companyId/outreach",

  // CHAT:
  //   "/app/company/:companyId/chat",
} as const

export const STORAGE_KEYS = {
  OWNER_TOKEN:
    "agentreach_owner_token",

  OWNER_USER:
    "agentreach_owner_user",

  COMPANY_TOKEN:
    "agentreach_company_token",

  COMPANY_DATA:
    "agentreach_company_data",
} as const