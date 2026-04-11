import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CompanyBriefing } from "@/data/mockData";
import ExecutiveSummary from "./ExecutiveSummary";
import KeyThemes from "./KeyThemes";
import RisksOpportunities from "./RisksOpportunities";
import Recommendations from "./Recommendations";
import TalkingPoints from "./TalkingPoints";
import ConfidenceGaps from "./ConfidenceGaps";
import FinancialBriefing from "./FinancialSnapshot";
import QASection from "./QASection";

interface Props {
  briefing: CompanyBriefing;
  onBack: () => void;
}

const BriefingDashboard = ({ briefing, onBack }: Props) => {
  const { insights } = briefing;
  const isPublic = briefing.public_or_private === "public";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-6 w-1 rounded-full bg-primary" />
          <span className="text-sm font-semibold text-foreground">Company Briefing</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Company Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground">{briefing.name}</h1>
          <Badge variant={isPublic ? "default" : "secondary"}>
            {isPublic ? "Public" : "Private"}
          </Badge>
          {briefing.ticker && (
            <Badge variant="outline">{briefing.ticker}</Badge>
          )}
        </div>

        {/* Section 1: Recent Briefing Based on News */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-primary" />
            Recent Briefing Based on News
          </h2>
          <div className="space-y-6">
            <ExecutiveSummary summary={insights.executive_summary} />
            <KeyThemes themes={insights.key_themes} />
            <RisksOpportunities risks={insights.risks} opportunities={insights.opportunities} />
            <Recommendations items={insights.recommendations_for_partner} />
            <TalkingPoints points={insights.partner_talking_points} />
            <ConfidenceGaps gaps={insights.confidence_gaps} />
          </div>
        </div>

        {/* Section 2: Financial Briefing (only if financial_insights present) */}
        {briefing.financial_insights && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-primary" />
              Financial Briefing
            </h2>
            <FinancialBriefing data={briefing.financial_insights} />
          </div>
        )}

        {/* Q&A */}
        <QASection />
      </main>
    </div>
  );
};

export default BriefingDashboard;
