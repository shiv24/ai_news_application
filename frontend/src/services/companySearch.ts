export interface CompanyResult {
  name: string;
  domain: string;
  logo: string | null;
}

export interface CompanySearchResponse {
  companies: CompanyResult[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function searchCompanies(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<CompanySearchResponse> {
  const response = await fetch(
    `${API_BASE_URL}/companies/search?name=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`
  );

  if (!response.ok) {
    throw new Error("Company search failed");
  }

  return response.json();
}
