
"use client"

import { Check, X, AlertCircle } from "lucide-react"
import { HSCodeResult } from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface HSResultsTableProps {
    results: HSCodeResult[]
    isLoading?: boolean
}

export function HSResultsTable({ results, isLoading }: HSResultsTableProps) {
    if (isLoading) {
        return (
            <div className="w-full h-24 flex items-center justify-center text-muted-foreground">
                Searching...
            </div>
        )
    }

    if (results.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No results found. Try a different search query.
            </div>
        )
    }

    return (
        <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[120px]">HS Code</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Description</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">Chapter</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">Duty</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[120px]">CBAM?</th>
                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {results.map((result) => (
                            <tr
                                key={result.hs_code}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                                <td className="p-4 align-middle font-mono font-medium">{result.hs_code}</td>
                                <td className="p-4 align-middle max-w-[300px] truncate" title={result.description}>
                                    {result.description}
                                </td>
                                <td className="p-4 align-middle">{result.chapter}</td>
                                <td className="p-4 align-middle">
                                    {result.basic_duty_rate}%
                                </td>
                                <td className="p-4 align-middle">
                                    {result.is_cbam_relevant ? (
                                        <Badge variant="success" className="gap-1">
                                            <Check className="h-3 w-3" /> Yes
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="gap-1 opacity-50">
                                            <X className="h-3 w-3" /> No
                                        </Badge>
                                    )}
                                </td>
                                <td className="p-4 align-middle">
                                    {result.is_restricted ? (
                                        <Badge variant="destructive" className="gap-1">
                                            <AlertCircle className="h-3 w-3" /> Restricted
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-green-600 border-green-200">
                                            Allowed
                                        </Badge>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
