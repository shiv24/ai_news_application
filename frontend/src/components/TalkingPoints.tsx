import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TalkingPoints = ({ points }: { points: string[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        Partner Talking Points
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground/80">
            <span className="mt-0.5 font-semibold text-primary text-xs">{i + 1}.</span>
            <span className="leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

export default TalkingPoints;
