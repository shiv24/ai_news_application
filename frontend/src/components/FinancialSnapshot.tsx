import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FinancialInsights } from "@/data/mockData";

const FinancialBriefing = ({ data }: { data: FinancialInsights }) => {
  const snapshotItems = [
    { label: "Price", value: data.snapshot.price },
    { label: "Market Cap", value: data.snapshot.market_cap },
    { label: "P/E", value: data.snapshot.pe },
    { label: "Sentiment", value: data.snapshot.analyst_sentiment },
  ];

  return (
    <div className="space-y-6">
      {/* Snapshot Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-primary" />
            Financial Snapshot
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              {data.ticker}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {snapshotItems.map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-base font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Revenue / EPS</p>
            <p className="text-sm font-medium text-foreground">{data.snapshot.revenue_or_eps}</p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-primary" />
            Financial Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Financial Health", text: data.financial_health },
            { label: "Valuation", text: data.valuation },
            { label: "Performance Trends", text: data.performance_trends },
          ].map((section) => (
            <div key={section.label} className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">{section.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Watch Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-primary" />
            Investors Should Watch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data.investors_should_watch.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-foreground/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialBriefing;
