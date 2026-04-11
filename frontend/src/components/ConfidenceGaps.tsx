import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConfidenceGaps = ({ gaps }: { gaps: string[] }) => (
  <Card className="border-dashed">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Info className="h-4 w-4 text-muted-foreground" />
        Confidence Gaps
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {gaps.map((g, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
            {g}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default ConfidenceGaps;
