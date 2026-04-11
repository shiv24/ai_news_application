import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { searchCompanies, type CompanyResult } from "@/services/companySearch";

interface SearchViewProps {
  onSearch: (domain: string, companyName: string) => void;
  error?: string | null;
}

const SearchView = ({ onSearch, error }: SearchViewProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 1000);

  const [results, setResults] = useState<CompanyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyResult | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setShowDropdown(false);
      setPage(1);
      setLastPage(1);
      setSearchError(null);
      return;
    }

    const id = ++requestIdRef.current;
    setIsLoading(true);
    setResults([]);
    setPage(1);
    setSearchError(null);
    setSelectedCompany(null);

    searchCompanies(debouncedQuery, 1)
      .then((res) => {
        if (id !== requestIdRef.current) return;
        setResults(res.companies);
        setLastPage(res.pagination.last_page);
        setPage(1);
        setShowDropdown(true);
      })
      .catch(() => {
        if (id !== requestIdRef.current) return;
        setSearchError("Failed to search. Please try again.");
      })
      .finally(() => {
        if (id === requestIdRef.current) setIsLoading(false);
      });
  }, [debouncedQuery]);

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (loadingMore || page >= lastPage || !debouncedQuery) return;
    const nextPage = page + 1;
    setLoadingMore(true);

    const id = requestIdRef.current; // don't increment — this is a pagination call
    searchCompanies(debouncedQuery, nextPage)
      .then((res) => {
        if (id !== requestIdRef.current) return;
        setResults((prev) => [...prev, ...res.companies]);
        setPage(nextPage);
        setLastPage(res.pagination.last_page);
      })
      .finally(() => {
        if (id === requestIdRef.current) setLoadingMore(false);
      });
  }, [loadingMore, page, lastPage, debouncedQuery]);

  const handleScroll = useCallback(() => {
    const el = dropdownRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      loadMore();
    }
  }, [loadMore]);

  const handleSelect = (company: CompanyResult) => {
    setShowDropdown(false);
    setQuery(company.name);
    setSelectedCompany(company);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const normalizedQuery = query.trim().toLowerCase();
    const exactMatch = results.find(
      (company) => company.name.trim().toLowerCase() === normalizedQuery
    );
    const companyToUse = selectedCompany ?? exactMatch ?? results[0];

    if (!companyToUse) {
      setSearchError("Please select a company from the dropdown.");
      return;
    }

    setSearchError(null);
    setShowDropdown(false);
    onSearch(companyToUse.domain, companyToUse.name);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8 text-center">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="h-8 w-1 rounded-full bg-primary" />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Company Briefing
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered company briefings. Enter a company name to
            generate a comprehensive overview.
          </p>
        </div>

        <div ref={containerRef} className="relative">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedCompany(null);
                }}
                onFocus={() => {
                  if (results.length > 0 && debouncedQuery) setShowDropdown(true);
                }}
                placeholder="e.g. Apple, Stripe, Tesla"
                className="pl-10 h-12 text-base"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
            <Button type="submit" size="lg" className="h-12 px-6">
              Generate Briefing
            </Button>
          </form>

          {selectedCompany && (
            <div className="mt-3 rounded-lg border bg-card px-4 py-3 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Selected For Analysis
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {selectedCompany.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedCompany.domain}
              </p>
            </div>
          )}

          {/* Dropdown */}
          {showDropdown && debouncedQuery && (
            <div
              ref={dropdownRef}
              onScroll={handleScroll}
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border bg-popover shadow-lg"
              style={{ minWidth: 0 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : results.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No companies found for "{debouncedQuery}"
                </div>
              ) : (
                <>
                  {results.map((company, idx) => (
                    <button
                      key={`${company.domain}-${idx}`}
                      type="button"
                      onClick={() => handleSelect(company)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
                    >
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-8 w-8 rounded-md border bg-white object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                      ) : null}
                      {!company.logo && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-muted">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {company.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {company.domain}
                        </p>
                      </div>
                    </button>
                  ))}
                  {loadingMore && (
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {(error || searchError) && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error || searchError}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Try{" "}
          <button
            type="button"
            onClick={() => setQuery("Apple")}
            className="underline text-primary hover:text-primary/80"
          >
            Apple
          </button>{" "}
          (public) or{" "}
          <button
            type="button"
            onClick={() => setQuery("Stripe")}
            className="underline text-primary hover:text-primary/80"
          >
            Stripe
          </button>{" "}
          (private)
        </p>
      </div>
    </div>
  );
};

export default SearchView;
