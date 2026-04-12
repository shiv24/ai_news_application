import { AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiskItem, OpportunityItem } from "@/types/companyBriefing";

interface Props {
  risks: RiskItem[];
  opportunities: OpportunityItem[];
}

const RisksOpportunities = ({ risks, opportunities }: Props) => (
  <div className="grid gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Risks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {risks.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive/60" />
              {r.risk}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {opportunities.map((o, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/80">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {o.opportunity}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  </div>
);

export default RisksOpportunities;
