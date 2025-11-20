"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { GitCompareArrows, Loader2 } from "lucide-react"
import { fetchAllApis } from "@/services/weatherApi"
import type { WeatherData } from "@/types/weather"

interface ApiComparisonProps {
  city: string
}

export default function ApiComparison({ city }: ApiComparisonProps) {
  const [data, setData] = useState<Record<string, WeatherData | null>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadComparison = async () => {
      if (!city) return

      setIsLoading(true)
      const results = await fetchAllApis(city)
      setData(results)
      setIsLoading(false)
    }

    loadComparison()
  }, [city])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="p-6 bg-card">
        <div className="flex items-center gap-2 mb-4">
          <GitCompareArrows className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Comparación de APIs</h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data).map(([api, weather]) => (
              <div key={api} className="p-4 rounded-lg bg-secondary/30 border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">{api}</h4>
                {weather ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-2xl font-bold text-foreground">{Math.round(weather.temp)}°C</span>
                      <span className="text-xs text-muted-foreground capitalize">{weather.condition}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Viento</p>
                        <p className="text-foreground font-medium">{weather.wind} km/h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Humedad</p>
                        <p className="text-foreground font-medium">{weather.humidity}%</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-destructive">Error al cargar datos</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
