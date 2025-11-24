import { useState, useEffect, useCallback } from "react"
import { fetchWeatherData, fetchForecast } from "../services/weatherApi"
import { detectThreats, validateType, sanitizeNumber, validateRange } from "@/lib/utils"
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

    const auditWeatherData = useCallback((
        data: WeatherData,
        api: "openweather" | "weatherapi" | "mock"
    ) => {
        const threats: string[] = []

        // Auditar cada campo
        const cityThreat = detectThreats(data.city)
        if (cityThreat.hasThreat) {
            threats.push(...cityThreat.threatType.map(t => `city: ${t}`))
        }

        const conditionThreat = detectThreats(data.condition)
        if (conditionThreat.hasThreat) {
            threats.push(...conditionThreat.threatType.map(t => `condition: ${t}`))
        }

        if (data.country) {
            const countryThreat = detectThreats(data.country)
            if (countryThreat.hasThreat) {
                threats.push(...countryThreat.threatType.map(t => `country: ${t}`))
            }
        }

        // Validar tipos
        if (!validateType(data.temp, "number", "temp")) {
            threats.push("temp: tipo incorrecto")
        }
        if (!validateType(data.humidity, "number", "humidity")) {
            threats.push("humidity: tipo incorrecto")
        }

        // Validar rangos lógicos
        if (typeof data.temp === "number") {
            if (data.temp < -100 || data.temp > 100) {
                threats.push("temp: valor fuera de rango razonable (-100 a 100°C)")
            }
        }

        if (typeof data.humidity === "number") {
            validateRange(data.humidity, 0, 100, "humidity")
            if (data.humidity < 0 || data.humidity > 100) {
                threats.push("humidity: debe estar entre 0-100%")
            }
        }

        if (typeof data.wind === "number" && data.wind < 0) {
            threats.push("wind: velocidad negativa")
        }

        if (typeof data.pressure === "number" && data.pressure < 0) {
            threats.push("pressure: presión negativa")
        }

        // Registrar amenazas encontradas
        if (threats.length > 0) {
            addAuditLog({
                message: `⚠️ ${threats.length} amenaza(s) detectada(s) en ${api}`,
                status: "threat",
                latency: 0,
                threats,
                apiSource: api,
            })
        }

        return threats.length === 0
    }, [addAuditLog])

    const fetchWeather = useCallback(
        async (city: string, api: typeof apiSource) => {
            setIsLoading(true)
            setError(null)
            const startTime = Date.now()

            try {
                const [weather, forecastData] = await Promise.all([
                    fetchWeatherData(city, api),
                    fetchForecast(city, api)
                ])

                const latency = Date.now() - startTime

                // Auditar los datos recibidos
                const isSafe = auditWeatherData(weather, api)

                setWeatherData(weather)
                setForecast(forecastData)

                addAuditLog({
                    message: `Datos cargados desde ${api}${!isSafe ? ' (CON AMENAZAS)' : ''}`,
                    status: isSafe ? "success" : "warning",
                    latency,
                    apiSource: api,
                })
            } catch (err) {
                const latency = Date.now() - startTime
                const errorMessage = err instanceof Error ? err.message : "Error desconocido"

                setError(errorMessage)
                addAuditLog({
                    message: `Error: ${errorMessage}`,
                    status: "error",
                    latency,
                    apiSource: api,
                })
            } finally {
                setIsLoading(false)
            }
        },
        [addAuditLog, auditWeatherData],
    )

    useEffect(() => {
        fetchWeather(initialCity, apiSource)
    }, [])

    return {
        weatherData,
        forecast,
        isLoading,
        error,
        auditLogs,
        fetchWeather,
    }
}