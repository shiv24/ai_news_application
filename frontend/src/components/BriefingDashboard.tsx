import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyBriefing } from "@/types/companyBriefing";
import ExecutiveSummary from "./ExecutiveSummary";
import KeyThemes from "./KeyThemes";
import RisksOpportunities from "./RisksOpportunities";
import Recommendations from "./Recommendations";
import TalkingPoints from "./TalkingPoints";
import ConfidenceGaps from "./ConfidenceGaps";
import FinancialBriefing from "./FinancialSnapshot";

interface Props {
  briefing: CompanyBriefing;
  onBack: () => void;
}

const BriefingDashboard = ({ briefing, onBack }: Props) => {
  const { insights } = briefing;
  const isPublic = briefing.public_or_private === "public";
  const backupSearchAnalysis = briefing.backup_search_analysis;
  const hasInsufficientInformation = briefing.insufficient_information === true;
  const sourceUrls = Array.from(
    new Set(
      [
        ...insights.key_themes.flatMap((item) => item.source_ids),
        ...insights.risks.flatMap((item) => item.source_ids),
        ...insights.opportunities.flatMap((item) => item.source_ids),
        ...insights.recommendations_for_partner.flatMap(
          (item) => item.source_ids,
        ),
      ]
        .map(extractUrlFromSourceId)
        .filter((url): url is string => Boolean(url)),
    ),
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-6 w-1 rounded-full bg-primary" />
          <span className="text-sm font-semibold text-foreground">
            Company Briefing
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        {/* Company Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground">
            {briefing.name}
          </h1>
          <Badge variant={isPublic ? "default" : "secondary"}>
            {isPublic ? "Public" : "Private"}
          </Badge>
          {briefing.ticker && (
            <Badge variant="outline">{briefing.ticker}</Badge>
          )}
        </div>

        {/* Section 1: Recent Briefing Based on News */}
        {!hasInsufficientInformation && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground flex underline underline-offset-2 items-center gap-2">
              <div className="h-5 w-1 rounded-full  bg-primary" />
              Recent Briefing Based on News
            </h2>
            <div className="space-y-6">
              <ExecutiveSummary summary={insights.executive_summary} />
              <KeyThemes themes={insights.key_themes} />
              <RisksOpportunities
                risks={insights.risks}
                opportunities={insights.opportunities}
              />
              <Recommendations items={insights.recommendations_for_partner} />
              <TalkingPoints points={insights.partner_talking_points} />
              <ConfidenceGaps gaps={insights.confidence_gaps} />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-4 w-1 rounded-full bg-primary" />
                    Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sourceUrls.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No source links available.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {sourceUrls.map((url, i) => (
                        <li key={`${url}-${i}`}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary underline break-all hover:text-primary/80"
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {backupSearchAnalysis && (
          <div className="space-y-2 border-t pt-8">
            <h2 className="text-lg font-semibold text-foreground flex underline underline-offset-2 items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-primary" />
              General Briefing
            </h2>
            <div className="space-y-6">
              <ExecutiveSummary
                summary={backupSearchAnalysis.executive_summary}
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-4 w-1 rounded-full bg-primary" />
                    Key Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {backupSearchAnalysis.key_themes.map((theme, index) => (
                      <div
                        key={`${theme.theme}-${index}`}
                        className="space-y-1"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {theme.theme}
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/80">
                          {theme.why_it_matters}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <TalkingPoints
                points={backupSearchAnalysis.partner_talking_points}
              />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-4 w-1 rounded-full bg-primary" />
                    Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {backupSearchAnalysis.sources_used.map((source, index) => (
                      <li key={`${source.url}-${index}`} className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {source.title}
                        </p>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-primary underline break-all hover:text-primary/80"
                        >
                          {source.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Section 2: Financial Briefing (only if financial_insights present) */}
        {briefing.financial_insights && (
          <div className="space-y-2 border-t pt-8">
            <h2 className="text-lg font-semibold text-foreground flex underline underline-offset-2 items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-primary" />
              Financial Briefing
            </h2>
            <FinancialBriefing data={briefing.financial_insights} />
          </div>
        )}
      </main>
    </div>
  );
};

function extractUrlFromSourceId(sourceId: string): string | null {
  const separator = "::";
  const firstSeparator = sourceId.indexOf(separator);
  if (firstSeparator === -1) return null;

  const candidateUrl = sourceId.slice(firstSeparator + separator.length);
  if (
    candidateUrl.startsWith("http://") ||
    candidateUrl.startsWith("https://")
  ) {
    return candidateUrl;
  }

  return null;
}

export default BriefingDashboard;
