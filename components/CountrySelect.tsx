"use client"

import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { Country } from "@/types/weather"

interface CountrySelectProps {
    selected: string
    onSelect: (country: string) => void
}

export const COUNTRIES: Country[] = [
    { name: "Madrid", code: "Madrid" },
    { name: "Barcelona", code: "Barcelona" },
    { name: "Colombia", code: "Colombia" },
    { name: "Paris", code: "Paris" },
    { name: "London", code: "London" },
    { name: "New York", code: "New York" },
    { name: "Tokyo", code: "Tokyo" },
    { name: "Berlin", code: "Berlin" },
    { name: "Rome", code: "Rome" },
    { name: "Buenos Aires", code: "Buenos Aires" },
]

export default function CountrySelect({ selected, onSelect }: CountrySelectProps) {
    return (
        <Card className="p-4 bg-card">
            <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-semibold text-foreground">Seleccionar Ciudad/País</h3>
            </div>

            <div className="relative">
                <select
                    value={selected}
                    onChange={(e) => onSelect(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground 
                   focus:outline-none focus:ring-2 focus:ring-primary transition-all
                   appearance-none cursor-pointer"
                >
                    {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                            {country.name}
                        </option>
                    ))}
                </select>

                {/* Custom dropdown arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2">
                Selecciona una ciudad para ver su información meteorológica
            </p>
        </Card>
    )
}