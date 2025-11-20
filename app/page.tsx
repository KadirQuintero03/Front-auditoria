"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cloud, Moon, Sun } from "lucide-react"
import WeatherCard from "../components/WeatherCard"
import ForecastChart from "../components/ForecastChart"
import ApiSelector from "../components/ApiSelector"
import ErrorBanner from "../components/ErrorBanner"
import AuditPanel from "../components/AuditPanel"
import SearchBar from "../components/SearchBar"
import ApiComparison from "../components/ApiComparison"
import { useWeather } from "../hooks/useWeather"
import { useTheme } from "../hooks/useTheme"

export default function Home() {
  const [city, setCity] = useState("Madrid")
  const [selectedApi, setSelectedApi] = useState<"openweather" | "weatherapi" | "mock">("openweather")
  const { weatherData, forecast, isLoading, error, auditLogs, fetchWeather } = useWeather(city, selectedApi)
  const { isDark, toggleTheme } = useTheme()

  const handleSearch = (newCity: string) => {
    setCity(newCity)
    fetchWeather(newCity, selectedApi)
  }

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                  <Cloud className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground text-balance">Dashboard de Clima</h1>
                  <p className="text-xs text-muted-foreground">Auditoría de Seguridad</p>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                aria-label="Cambiar tema"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-secondary-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-secondary-foreground" />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <ErrorBanner message={error} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            <ApiSelector selected={selectedApi} onSelect={setSelectedApi} />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <WeatherCard data={weatherData} isLoading={isLoading} apiSource={selectedApi} />
            </div>
            <div>
              <AuditPanel logs={auditLogs} />
            </div>
          </div>

          {/* Forecast Chart */}
          <div className="mb-8">
            <ForecastChart data={forecast} isLoading={isLoading} />
          </div>

          {/* API Comparison */}
          <div>
            <ApiComparison city={city} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-12">
          <div className="container mx-auto px-4 py-6">
            <p className="text-center text-sm text-muted-foreground">
              Dashboard de Clima - Proyecto de Auditoría de Seguridad © 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
