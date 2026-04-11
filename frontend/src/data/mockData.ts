// Types matching the backend API response shape

export interface KeyTheme {
  theme: string;
  why_it_matters: string;
  source_ids: string[];
}

export interface RiskItem {
  risk: string;
  source_ids: string[];
}

export interface OpportunityItem {
  opportunity: string;
  source_ids: string[];
}

export interface Recommendation {
  recommendation: string;
  reasoning: string;
  source_ids: string[];
}

export interface Insights {
  executive_summary: string;
  key_themes: KeyTheme[];
  risks: RiskItem[];
  opportunities: OpportunityItem[];
  recommendations_for_partner: Recommendation[];
  partner_talking_points: string[];
  confidence_gaps: string[];
}

export interface FinancialSnapshot {
  price: string;
  market_cap: string;
  pe: string;
  revenue_or_eps: string;
  analyst_sentiment: string;
}

export interface FinancialInsights {
  company_name: string;
  ticker: string;
  snapshot: FinancialSnapshot;
  financial_health: string;
  valuation: string;
  performance_trends: string;
  investors_should_watch: string[];
}

export interface CompanyBriefing {
  name: string;
  public_or_private: "public" | "private";
  ticker: string | null;
  insights: Insights;
  financial_insights?: FinancialInsights;
}

// ── Mock data ──

export const mockData: Record<string, CompanyBriefing> = {
  apple: {
    name: "Apple",
    public_or_private: "public",
    ticker: "AAPL",
    insights: {
      executive_summary:
        "Apple continues to demonstrate resilient growth driven by its Services segment, which now accounts for over 22% of total revenue. The company's installed base of active devices exceeded 2.2 billion globally in Q1 2025. iPhone remains the primary revenue driver at ~52% of sales, though growth has moderated. Apple's push into spatial computing with Vision Pro represents a strategic bet on next-generation computing, though early adoption has been slower than anticipated. The company maintains industry-leading margins and a fortress balance sheet with $162B in cash.",
      key_themes: [
        {
          theme: "Services segment is becoming the growth engine",
          why_it_matters:
            "Services revenue grew 14% YoY to $96B and is now the highest-margin segment, providing durable recurring revenue from the 2.2B installed device base.",
          source_ids: ["s1"],
        },
        {
          theme: "Apple Intelligence positions the company for on-device AI leadership",
          why_it_matters:
            "Apple's privacy-first, on-device AI approach differentiates it from cloud-dependent competitors and could reshape enterprise data privacy expectations.",
          source_ids: ["s2"],
        },
        {
          theme: "Greater China revenue under pressure from Huawei's resurgence",
          why_it_matters:
            "China revenue declined 2% as Huawei's Mate 70 series recaptured premium smartphone share, threatening Apple's position in its third-largest market.",
          source_ids: ["s4"],
        },
      ],
      risks: [
        { risk: "Vision Pro adoption remains below internal targets, raising questions about the spatial computing bet.", source_ids: ["s3"] },
        { risk: "Intensifying competition in China from Huawei, Xiaomi, and other local players could erode market share further.", source_ids: ["s4"] },
        { risk: "Regulatory scrutiny in the EU around App Store practices may pressure Services margins.", source_ids: [] },
      ],
      opportunities: [
        { opportunity: "Apple Intelligence could drive a significant upgrade cycle as AI features become available across the product line.", source_ids: ["s2"] },
        { opportunity: "Vision Pro, while slow initially, establishes Apple in spatial computing ahead of competitors for a multi-generation platform play.", source_ids: ["s3"] },
        { opportunity: "Expansion into emerging markets (India, Southeast Asia) with new retail stores could unlock growth.", source_ids: [] },
      ],
      recommendations_for_partner: [
        {
          recommendation: "Probe the trajectory of Services revenue growth and its sustainability as the installed base matures.",
          reasoning: "Services is the key margin driver. Understanding whether growth can maintain double-digit rates is critical for valuation.",
          source_ids: ["s1"],
        },
        {
          recommendation: "Assess Apple's competitive position in China beyond headline revenue numbers.",
          reasoning: "The China story requires understanding product-level share shifts, not just aggregate revenue trends.",
          source_ids: ["s4"],
        },
      ],
      partner_talking_points: [
        "Apple's Services segment is the strategic story — it grew 14% YoY and is the highest-margin business.",
        "China is the key near-term risk: Huawei's resurgence is real and revenue declined 2%.",
        "Apple Intelligence is the most important product initiative — it could drive an upgrade supercycle.",
        "Vision Pro is a long-term bet. Don't judge it on current sales; judge it on platform potential.",
        "The $110B buyback signals management confidence in sustained cash generation.",
      ],
      confidence_gaps: [
        "We lack direct management commentary on China competitive dynamics beyond reported revenue figures.",
        "Vision Pro sales data is based on analyst estimates, not official Apple disclosures.",
        "AI integration impact on upgrade cycles is speculative at this stage.",
      ],
    },
    financial_insights: {
      company_name: "Apple Inc.",
      ticker: "AAPL",
      snapshot: {
        price: "$227.48",
        market_cap: "$3.45T",
        pe: "31.2",
        revenue_or_eps: "EPS (TTM): $6.97; FY2024 revenue: $391.0B",
        analyst_sentiment: "Buy",
      },
      financial_health:
        "Apple maintains a fortress balance sheet with approximately $162B in cash and equivalents. The company generated $110B in free cash flow in FY2024, supporting the largest buyback program in corporate history.",
      valuation:
        "AAPL trades at 31.2x trailing earnings, a premium to the S&P 500 but justified by consistent execution, high margins, and the growing Services revenue stream.",
      performance_trends:
        "Revenue grew 6.2% YoY to $391B in FY2024, driven primarily by Services (+14%). iPhone revenue was roughly flat as the upgrade cycle normalized. EBITDA margin expanded to 34.4%.",
      investors_should_watch: [
        "Services revenue trajectory — can double-digit growth continue as the installed base matures?",
        "iPhone upgrade cycle dynamics as Apple Intelligence features roll out across the product line.",
        "China competitive trends, particularly Huawei's premium market share gains.",
        "Vision Pro adoption metrics and whether the platform attracts meaningful developer investment.",
      ],
    },
  },
  stripe: {
    name: "Stripe",
    public_or_private: "private",
    ticker: null,
    insights: {
      executive_summary:
        "Stripe has solidified its position as the dominant payments infrastructure provider for internet businesses, processing over $1 trillion in total payment volume in 2024. The company achieved GAAP profitability for the first time, reigniting IPO speculation. Stripe's expansion beyond core payments — into billing, tax, treasury, and identity — has transformed it into a comprehensive financial platform. The latest valuation of $91B reflects renewed investor confidence after the 2022 down-round to $50B.",
      key_themes: [
        {
          theme: "Stripe achieved GAAP profitability, clearing the path to potential IPO",
          why_it_matters:
            "Profitability removes the last major barrier to a public listing and validates Stripe's unit economics at scale.",
          source_ids: ["s2", "s4"],
        },
        {
          theme: "Enterprise segment is the fastest-growing part of the business",
          why_it_matters:
            "Enterprise now accounts for ~40% of revenue with notable wins including Toyota and BMW, signaling successful upmarket expansion.",
          source_ids: ["s3"],
        },
        {
          theme: "Geographic expansion accelerating into emerging markets",
          why_it_matters:
            "Stripe is now available in 50+ countries after expanding to 15 new markets, extending its addressable opportunity.",
          source_ids: ["s1"],
        },
      ],
      risks: [
        { risk: "IPO timing uncertainty — the Collison brothers have historically been patient, and macroeconomic conditions could delay further.", source_ids: ["s2"] },
        { risk: "Increasing competition from Adyen, Checkout.com, and embedded finance players in the enterprise segment.", source_ids: ["s3"] },
        { risk: "Regulatory complexity in new markets could slow international expansion or compress margins.", source_ids: [] },
      ],
      opportunities: [
        { opportunity: "IPO could unlock significant value and provide currency for acquisitions.", source_ids: ["s2", "s4"] },
        { opportunity: "Billing, tax, and treasury products create multi-product revenue per customer, increasing switching costs.", source_ids: [] },
        { opportunity: "AI-powered revenue recovery in Billing v3 demonstrates product innovation that differentiates from commoditized payment rails.", source_ids: [] },
      ],
      recommendations_for_partner: [
        {
          recommendation: "Assess whether Stripe's enterprise traction is sustainable against established competitors like Adyen.",
          reasoning: "Enterprise is the growth driver but also the most competitive segment. Understanding win rates and churn is critical.",
          source_ids: ["s3"],
        },
        {
          recommendation: "Evaluate the multi-product strategy's impact on net revenue retention.",
          reasoning: "Stripe's expansion beyond payments into billing, tax, and treasury should drive higher NRR, which is the key SaaS metric for durability.",
          source_ids: [],
        },
      ],
      partner_talking_points: [
        "Stripe processed $1T+ in payments in 2024 — that's 25% growth and massive scale.",
        "GAAP profitability is the headline: it validates the business model and opens the IPO door.",
        "Enterprise is 40% of revenue and growing fastest — Toyota and BMW are marquee wins.",
        "The $91B valuation recovery from $50B signals strong investor confidence.",
        "Multi-product expansion (billing, tax, treasury) is the moat — it's not just payments anymore.",
      ],
      confidence_gaps: [
        "As a private company, financial details are limited to reported figures and secondary market data.",
        "Enterprise win rate and retention metrics are not publicly disclosed.",
        "IPO timing remains speculative — no official announcement has been made.",
      ],
    },
    // No financial_insights because ticker is null (private company)
  },
};
