
"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface HSSearchFormProps {
    onSearch: (query: string) => void
    isLoading?: boolean
}

export function HSSearchForm({ onSearch, isLoading }: HSSearchFormProps) {
    const [query, setQuery] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query.trim())
        }
    }

    return (
        <Card className="w-full">
            <CardContent className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Search HS Code or Description (e.g. 'steel', '720610')"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !query.trim()}>
                        {isLoading ? (
                            <span className="animate-spin mr-2">⏳</span>
                        ) : (
                            <Search className="mr-2 h-4 w-4" />
                        )}
                        Search
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
