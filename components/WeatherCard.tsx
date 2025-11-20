"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Cloud, CloudRain, CloudSnow, Sun, CloudFog, Wind, Droplets, Gauge, Eye, Loader2 } from "lucide-react"
import type { WeatherData } from "@/types/weather"

interface WeatherCardProps {
  data: WeatherData | null
  isLoading: boolean
  apiSource: string
}

const getWeatherIcon = (condition: string) => {
  const cond = condition.toLowerCase()
  if (cond.includes("rain") || cond.includes("lluvia")) return CloudRain
  if (cond.includes("snow") || cond.includes("nieve")) return CloudSnow
  if (cond.includes("cloud") || cond.includes("nube")) return Cloud
  if (cond.includes("fog") || cond.includes("niebla")) return CloudFog
  return Sun
}

export default function WeatherCard({ data, isLoading, apiSource }: WeatherCardProps) {
  if (isLoading) {
    return (
      <Card className="p-8 bg-card">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="p-8 bg-card">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Busca una ciudad para ver el clima</p>
        </div>
      </Card>
    )
  }

  const WeatherIcon = getWeatherIcon(data.condition)

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-1">{data.city}</h2>
            <p className="text-sm text-muted-foreground uppercase tracking-wider">API: {apiSource}</p>
          </div>
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
            <WeatherIcon className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-foreground">{Math.round(data.temp)}</span>
              <span className="text-3xl text-muted-foreground">°C</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2 capitalize">{data.condition}</p>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Sensación:</span>
              <span className="text-lg font-semibold text-foreground">{Math.round(data.feelsLike)}°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Min/Max:</span>
              <span className="text-lg font-semibold text-foreground">
                {Math.round(data.tempMin)}° / {Math.round(data.tempMax)}°
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Wind className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Viento</p>
              <p className="text-sm font-semibold text-foreground">{data.wind} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Droplets className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Humedad</p>
              <p className="text-sm font-semibold text-foreground">{data.humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Gauge className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Presión</p>
              <p className="text-sm font-semibold text-foreground">{data.pressure} hPa</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <Eye className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Visibilidad</p>
              <p className="text-sm font-semibold text-foreground">{(data.visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
