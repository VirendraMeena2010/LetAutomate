import { apiClient } from "./api"

import type {
  ResearchRequest,
  ResearchResponse,
  ResearchDetail,
  ResearchHistoryItem,
  GuestResearchRequest,
} from "@/types/research"

export const researchApi = {
  // ============================================================
  // RUN AUTHENTICATED RESEARCH
  // ============================================================
  runResearch: async (
    data: ResearchRequest
  ): Promise<ResearchResponse> => {
    const response = await apiClient.post<ResearchResponse>(
      "/run",
      data
    )

    return response.data
  },

  // ============================================================
  // GUEST RESEARCH
  // ============================================================
  runGuestResearch: async (
    data: GuestResearchRequest
  ): Promise<ResearchResponse> => {
    const response = await apiClient.post<ResearchResponse>(
      "/guestmode",
      data
    )

    return response.data
  },

  // ============================================================
  // GET RESEARCH HISTORY
  // ============================================================
  getResearchHistory: async (): Promise<ResearchHistoryItem[]> => {
    const response = await apiClient.get<{
      success: boolean
      research: ResearchHistoryItem[]
    }>("/research")

    return response.data.research
  },

  // ============================================================
  // GET SINGLE RESEARCH
  // ============================================================
  getResearchById: async (
    researchId: string
  ): Promise<ResearchDetail> => {
    const response = await apiClient.get<ResearchDetail>(
      `/research/${researchId}`
    )

    return response.data
  },
}