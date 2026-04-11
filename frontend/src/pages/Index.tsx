import { useState } from "react";
import SearchView from "@/components/SearchView";
import LoadingState from "@/components/LoadingState";
import BriefingDashboard from "@/components/BriefingDashboard";
import { mockData, type CompanyBriefing } from "@/data/mockData";

type AppState = "search" | "loading" | "briefing";

const Index = () => {
  const [state, setState] = useState<AppState>("search");
  const [briefing, setBriefing] = useState<CompanyBriefing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setError(null);
    setSearchQuery(query);
    const key = query.toLowerCase().trim();
    const found = mockData[key];

    if (!found) {
      setError(
        `No briefing data found for "${query}". Try "Apple" or "Stripe" for a demo.`
      );
      return;
    }

    setState("loading");
    setTimeout(() => {
      setBriefing(found);
      setState("briefing");
    }, 2000);
  };

  const handleBack = () => {
    setState("search");
    setBriefing(null);
    setError(null);
  };

  if (state === "loading") return <LoadingState companyName={searchQuery} />;
  if (state === "briefing" && briefing)
    return <BriefingDashboard briefing={briefing} onBack={handleBack} />;

  return <SearchView onSearch={handleSearch} error={error} />;
};

export default Index;
