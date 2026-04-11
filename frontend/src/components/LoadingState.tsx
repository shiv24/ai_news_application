import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const LoadingState = ({ companyName }: { companyName: string }) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
          <div className="h-6 w-1 rounded-full bg-primary" />
          <span className="ml-2 text-sm font-semibold text-foreground">Company Briefing</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Generating briefing for</p>
          <Skeleton className="h-8 w-48" />
          <p className="text-xs text-muted-foreground animate-pulse">
            Analyzing sources for {companyName}…
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardHeader><Skeleton className="h-5 w-40" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-32" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /></CardContent></Card>
          </div>
          <div className="space-y-6">
            <Card><CardHeader><Skeleton className="h-5 w-36" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-5 w-28" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full" /></CardContent></Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoadingState;
