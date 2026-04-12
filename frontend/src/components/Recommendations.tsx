import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recommendation } from "@/types/companyBriefing";

const Recommendations = ({ items }: { items: Recommendation[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        Recommendations for Partner
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {items.map((r, i) => (
        <div key={i} className="space-y-1 border-b last:border-0 pb-3 last:pb-0">
          <p className="text-sm font-medium text-foreground">{r.recommendation}</p>
          <p className="text-sm text-foreground/70 leading-relaxed">{r.reasoning}</p>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default Recommendations;
