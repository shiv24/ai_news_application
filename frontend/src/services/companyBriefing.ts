import type { CompanyBriefing } from "@/data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export async function generateCompanyBriefing(
  domain: string
): Promise<CompanyBriefing> {
  const response = await fetch(`${API_BASE_URL}/company`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ domain }),
  });

  if (!response.ok) {
    throw new Error("Company briefing generation failed");
  }

  return response.json();
}
