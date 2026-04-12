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

export interface BackupSearchTheme {
  theme: string;
  why_it_matters: string;
}

export interface BackupSearchSource {
  title: string;
  url: string;
}

export interface BackupSearchAnalysis {
  executive_summary: string;
  key_themes: BackupSearchTheme[];
  partner_talking_points: string[];
  sources_used: BackupSearchSource[];
}

export interface CompanyBriefing {
  name: string;
  public_or_private: "public" | "private";
  ticker: string | null;
  insufficient_information?: boolean;
  insights: Insights;
  backup_search_analysis?: BackupSearchAnalysis | null;
  financial_insights?: FinancialInsights | null;
}
