import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  summary: string;
}

const ExecutiveSummary = ({ summary }: Props) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        Executive Summary
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm leading-relaxed text-foreground/90">{summary}</p>
    </CardContent>
  </Card>
);

export default ExecutiveSummary;
