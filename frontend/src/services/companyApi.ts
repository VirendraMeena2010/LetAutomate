import { apiClient } from "./api"
import type { Company } from "@/types/auth"

export const companyApi = {
  /**
   * Get all companies owned by the currently authenticated owner.
   *
   * Backend:
   * GET /companies
   *
   * Authentication:
   * Owner JWT is automatically attached by apiClient.
   */
  getOwnerCompanies: async (): Promise<Company[]> => {
    const response = await apiClient.get<Company[]>("/companies")

    return response.data
  },

  /**
   * Get a single company.
   *
   * Backend endpoint not implemented yet.
   */
  getCompany: async (
    _companyId: string
  ): Promise<Company | null> => {
    throw new Error(
      "GET /company/{id} is not available in the backend yet"
    )
  },

  /**
   * Update a company.
   *
   * Backend endpoint not implemented yet.
   */
  updateCompany: async (
    _companyId: string,
    _data: Partial<Company>
  ): Promise<Company> => {
    throw new Error(
      "PATCH /company/{id} is not available in the backend yet"
    )
  },
}