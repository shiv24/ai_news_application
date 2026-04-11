import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { KeyTheme } from "@/data/mockData";

const KeyThemes = ({ themes }: { themes: KeyTheme[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-primary" />
        Key Themes
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {themes.map((t, i) => (
        <div key={i} className="space-y-1">
          <div className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <p className="text-sm font-medium text-foreground">{t.theme}</p>
          </div>
          <p className="text-sm text-foreground/70 pl-3.5 leading-relaxed">
            {t.why_it_matters}
          </p>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default KeyThemes;
