"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Cloud, Database, AlertTriangle } from "lucide-react"

interface ApiSelectorProps {
  selected: "openweather" | "weatherapi" | "mock"
  onSelect: (api: "openweather" | "weatherapi" | "mock") => void
}

const apis = [
  {
    id: "openweather" as const,
    name: "OpenWeather",
    icon: Cloud,
    color: "text-chart-1",
  },
  {
    id: "weatherapi" as const,
    name: "WeatherAPI",
    icon: Database,
    color: "text-chart-2",
  },
  {
    id: "mock" as const,
    name: "Mock (Malicioso)",
    icon: AlertTriangle,
    color: "text-destructive",
  },
]

export default function ApiSelector({ selected, onSelect }: ApiSelectorProps) {
  return (
    <Card className="p-4 bg-card">
      <h3 className="text-sm font-semibold text-foreground mb-3">Proveedor de API</h3>
      <div className="grid grid-cols-3 gap-2">
        {apis.map((api) => {
          const Icon = api.icon
          const isSelected = selected === api.id

          return (
            <motion.button
              key={api.id}
              onClick={() => onSelect(api.id)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                isSelected ? "bg-primary/10 border-primary" : "bg-secondary/30 border-border hover:border-primary/50"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-5 h-5 ${isSelected ? api.color : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                {api.name}
              </span>
              {isSelected && (
                <motion.div
                  layoutId="selected-api"
                  className="absolute inset-0 border-2 border-primary rounded-lg"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </Card>
  )
}
