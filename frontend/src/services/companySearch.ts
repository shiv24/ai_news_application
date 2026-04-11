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

// Mock data generator — will be replaced with real API call later
const mockCompanies: Record<string, CompanyResult[]> = {
  apple: [
    { name: "Apple", domain: "apple.com", logo: "https://thecompaniesapi.s3.fr-par.scw.cloud/companies/logos/square/apple.com.jpg" },
    { name: "Apple Leisure Group", domain: "appleleisuregroup.com", logo: "https://thecompaniesapi.s3.fr-par.scw.cloud/companies/logos/square/appleleisuregroup.com.jpg" },
    { name: "Applebee's", domain: "applebees.com", logo: "https://thecompaniesapi.s3.fr-par.scw.cloud/companies/logos/square/applebees.com.jpg" },
    { name: "Apple Federal Credit Union", domain: "applefcu.org", logo: null },
    { name: "Apple Vacations", domain: "applevacations.com", logo: null },
  ],
  stripe: [
    { name: "Stripe", domain: "stripe.com", logo: "https://thecompaniesapi.s3.fr-par.scw.cloud/companies/logos/square/stripe.com.jpg" },
    { name: "Stripe Climate", domain: "stripe.com/climate", logo: null },
    { name: "Stripe Atlas", domain: "stripe.com/atlas", logo: null },
  ],
  tesla: [
    { name: "Tesla", domain: "tesla.com", logo: "https://thecompaniesapi.s3.fr-par.scw.cloud/companies/logos/square/tesla.com.jpg" },
    { name: "Tesla Outsourcing Services", domain: "teslaoutsourcingservices.com", logo: "https://thecompaniesapi.s3.fr-par.scw.cloud/companies/logos/square/teslaoutsourcingservices.com.jpg" },
    { name: "TESLA Solar Power", domain: "teslagosolar.com", logo: "https://thecompaniesapi.s3.fr-par.scw.cloud/companies/logos/square/teslagosolar.com.jpg" },
    { name: "Tesla CAD", domain: "teslacad.co.uk", logo: "https://thecompaniesapi.s3.fr-par.scw.cloud/companies/logos/square/teslacad.co.uk.jpg" },
    { name: "Tesla Limousine", domain: "limousineline.com.au", logo: null },
    { name: "Tesla Energy", domain: "teslaenergy.cl", logo: "https://teslaenergy.cl/favicon.png" },
    { name: "Tesla Hire WA", domain: "teslahirewa.com", logo: null },
    { name: "TESLA Forecasting Solutions", domain: "teslaforecast.com", logo: null },
    { name: "Tesla Consultants", domain: "niko.nz", logo: null },
    { name: "Tesla™", domain: "teslaind.com", logo: null },
    { name: "Tesla Parts Inc", domain: "teslaparts.com", logo: null },
    { name: "Tesla Labs", domain: "teslalabs.io", logo: null },
  ],
};

export async function searchCompanies(
  query: string,
  page: number = 1,
  perPage: number = 5
): Promise<CompanySearchResponse> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  const key = query.toLowerCase().trim();
  const allResults = mockCompanies[key] ?? [];
  const total = allResults.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const companies = allResults.slice(start, start + perPage);

  return {
    companies,
    pagination: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total,
    },
  };
}
