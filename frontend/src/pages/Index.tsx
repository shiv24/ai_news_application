import { useState } from "react";
import SearchView from "@/components/SearchView";
import LoadingState from "@/components/LoadingState";
import BriefingDashboard from "@/components/BriefingDashboard";
import type { CompanyBriefing } from "@/data/mockData";
import { generateCompanyBriefing } from "@/services/companyBriefing";

type AppState = "search" | "loading" | "briefing";

const Index = () => {
  const [state, setState] = useState<AppState>("search");
  const [briefing, setBriefing] = useState<CompanyBriefing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (domain: string, companyName: string) => {
    setError(null);
    setSearchQuery(companyName);
    setState("loading");
    try {
      const response = await generateCompanyBriefing(domain);
      setBriefing(response);
      setState("briefing");
    } catch {
      setState("search");
      setError("Failed to generate briefing. Please try again.");
    }
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
