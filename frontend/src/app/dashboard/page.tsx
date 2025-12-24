
"use client";

import { useState } from "react";
import { hsCodeApi, HSCodeResult } from "@/lib/api";
import { HSSearchForm } from "@/components/hs-lookup/hs-search-form";
import { HSResultsTable } from "@/components/hs-lookup/hs-results-table";

export default function DashboardPage() {
    const [searchResults, setSearchResults] = useState<HSCodeResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (query: string) => {
        setSearching(true);
        setHasSearched(true);
        try {
            const response = await hsCodeApi.search(query);
            setSearchResults(response.data.results);
        } catch (error) {
            console.error("Search failed:", error);
            // Could add toast notification here
        } finally {
            setSearching(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">HS Code Lookup</h1>
                <p className="text-gray-400">Search for Indian HS codes and check CBAM applicability</p>
            </div>

            <div className="max-w-3xl mb-8">
                <HSSearchForm onSearch={handleSearch} isLoading={searching} />
            </div>

            {hasSearched && (
                <div className="animation-fade-in">
                    <HSResultsTable results={searchResults} isLoading={searching} />
                </div>
            )}

            {!hasSearched && (
                <div className="text-center py-16 opacity-50">
                    <p className="text-gray-500">Start by searching for a product code or name.</p>
                </div>
            )}
        </div>
    );
}
