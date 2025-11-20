"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchWeatherData, fetchForecast } from "../services/weatherApi"
import type { WeatherData, ForecastData, AuditLog } from "../types/weather"

export function useWeather(initialCity: string, apiSource: "openweather" | "weatherapi" | "mock") {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [forecast, setForecast] = useState<ForecastData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

    const addAuditLog = useCallback((log: Omit<AuditLog, "id" | "timestamp">) => {
        const newLog: AuditLog = {
            ...log,
            id: Date.now().toString(),
            timestamp: new Date().toLocaleTimeString("es-ES"),
        }
        setAuditLogs((prev) => [...prev, newLog])
    }, [])

    const fetchWeather = useCallback(
        async (city: string, api: typeof apiSource) => {
            setIsLoading(true)
            setError(null)
            const startTime = Date.now()

            try {
                const [weather, forecastData] = await Promise.all([fetchWeatherData(city, api), fetchForecast(city, api)])

                const latency = Date.now() - startTime

                setWeatherData(weather)
                setForecast(forecastData)

                addAuditLog({
                    message: `Datos cargados exitosamente desde ${api}`,
                    status: "success",
                    latency,
                })
            } catch (err) {
                const latency = Date.now() - startTime
                const errorMessage = err instanceof Error ? err.message : "Error desconocido"

                setError(errorMessage)
                addAuditLog({
                    message: `Error: ${errorMessage}`,
                    status: "error",
                    latency,
                })
            } finally {
                setIsLoading(false)
            }
        },
        [addAuditLog],
    )

    useEffect(() => {
        fetchWeather(initialCity, apiSource)
    }, []) // Solo ejecutar al montar

    return {
        weatherData,
        forecast,
        isLoading,
        error,
        auditLogs,
        fetchWeather,
    }
}
