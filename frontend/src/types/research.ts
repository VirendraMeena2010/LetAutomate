export interface ResearchRequest {
  target_company_name: string
  target_company_website?: string
  target_company_industry?: string
}

export interface ResearchResponse {
  success: boolean
  research_id: string

  status: "pending" | "processing" | "completed" | "failed"
  current_step?: string
  progress: number
  progress_message?: string

  company_research?: Record<string, unknown> | null
  website_analysis?: Record<string, unknown> | null
  news_intelligence?: Record<string, unknown> | null
  hiring_intelligence?: Record<string, unknown> | null
  demand_intelligence?: Record<string, unknown> | null
  company_intelligence?: Record<string, unknown> | null
  final_report?: Record<string, unknown> | null

  error?: string | null
}

export interface ResearchHistoryItem {
  research_id: string
  target_company_name: string
  target_company_website?: string | null
  target_company_industry?: string | null

  status: "pending" | "processing" | "completed" | "failed"
  progress: number

  created_at: string
  completed_at?: string | null
}

export interface ResearchDetail {
  research_id: string

  target_company_name: string
  target_company_website?: string | null
  target_company_industry?: string | null

  status: "pending" | "processing" | "completed" | "failed"
  progress: number

  created_at: string
  completed_at?: string | null

  company_research?: Record<string, unknown> | null
  website_analysis?: Record<string, unknown> | null
  news_intelligence?: Record<string, unknown> | null
  hiring_intelligence?: Record<string, unknown> | null
  demand_intelligence?: Record<string, unknown> | null
  company_intelligence?: Record<string, unknown> | null
  final_report?: Record<string, unknown> | null
}

export interface GuestResearchRequest {
  target_company_name: string
  target_company_industry: string
  target_company_website: string
  your_services: string
}