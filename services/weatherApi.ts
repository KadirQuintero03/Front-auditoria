import { sanitizeData, validateWeatherResponse } from "../utils/sanitize"
import type { WeatherData, ForecastData } from "../types/weather"

const OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5"
const WEATHERAPI_BASE = "https://api.weatherapi.com/v1"

export async function fetchWeatherData(
    city: string,
    apiSource: "openweather" | "weatherapi" | "mock",
): Promise<WeatherData> {
    console.log("[v0] Fetching weather data for:", city, "from:", apiSource)

    if (apiSource === "mock") {
        return fetchMockWeather(city)
    }

    if (apiSource === "openweather") {
        return fetchOpenWeather(city)
    }

    return fetchWeatherApiData(city)
}

export async function fetchForecast(
    city: string,
    apiSource: "openweather" | "weatherapi" | "mock",
): Promise<ForecastData[]> {
    if (apiSource === "mock") {
        return fetchMockForecast(city)
    }

    if (apiSource === "openweather") {
        return fetchOpenWeatherForecast(city)
    }

    return fetchWeatherApiForecast(city)
}

async function fetchOpenWeather(city: string): Promise<WeatherData> {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "demo"

    const response = await fetch(
        `${OPENWEATHER_BASE}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=es`,
        { headers: { Accept: "application/json" } },
    )

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    validateWeatherResponse(data, "openweather")

    return {
        city: sanitizeData(data.name),
        temp: data.main?.temp ?? 0,
        feelsLike: data.main?.feels_like ?? 0,
        tempMin: data.main?.temp_min ?? 0,
        tempMax: data.main?.temp_max ?? 0,
        condition: sanitizeData(data.weather?.[0]?.description ?? "desconocido"),
        humidity: data.main?.humidity ?? 0,
        pressure: data.main?.pressure ?? 0,
        wind: data.wind?.speed ? Math.round(data.wind.speed * 3.6) : 0,
        visibility: data.visibility ?? 0,
    }
}

async function fetchWeatherApiData(city: string): Promise<WeatherData> {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY_2 || "demo"

    const response = await fetch(`${WEATHERAPI_BASE}/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&lang=es`, {
        headers: { Accept: "application/json" },
    })

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    validateWeatherResponse(data, "weatherapi")

    return {
        city: sanitizeData(data.location?.name),
        temp: data.current?.temp_c ?? 0,
        feelsLike: data.current?.feelslike_c ?? 0,
        tempMin: data.current?.temp_c ?? 0,
        tempMax: data.current?.temp_c ?? 0,
        condition: sanitizeData(data.current?.condition?.text ?? "desconocido"),
        humidity: data.current?.humidity ?? 0,
        pressure: data.current?.pressure_mb ?? 0,
        wind: data.current?.wind_kph ?? 0,
        visibility: data.current?.vis_km ? data.current.vis_km * 1000 : 0,
    }
}

async function fetchOpenWeatherForecast(city: string): Promise<ForecastData[]> {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "demo"

    const response = await fetch(
        `${OPENWEATHER_BASE}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=es`,
        { headers: { Accept: "application/json" } },
    )

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`)
    }

    const data = await response.json()

    const dailyData: Record<string, { temps: number[] }> = {}

    data.list?.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
        })

        if (!dailyData[date]) {
            dailyData[date] = { temps: [] }
        }

        dailyData[date].temps.push(item.main.temp)
    })

    return Object.entries(dailyData)
        .map(([date, data]) => ({
            date: sanitizeData(date),
            tempMax: Math.max(...data.temps),
            tempMin: Math.min(...data.temps),
        }))
        .slice(0, 7)
}

async function fetchWeatherApiForecast(city: string): Promise<ForecastData[]> {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY_2 || "demo"

    const response = await fetch(
        `${WEATHERAPI_BASE}/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=7&lang=es`,
        { headers: { Accept: "application/json" } },
    )

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`)
    }

    const data = await response.json()

    return (data.forecast?.forecastday || []).map((day: any) => ({
        date: sanitizeData(
            new Date(day.date).toLocaleDateString("es-ES", {
                weekday: "short",
                day: "numeric",
            }),
        ),
        tempMax: day.day?.maxtemp_c ?? 0,
        tempMin: day.day?.mintemp_c ?? 0,
    }))
}

async function fetchMockWeather(city: string): Promise<WeatherData> {
    const response = await fetch("/api/mock/malicious")

    if (!response.ok) {
        throw new Error("Error en API mock")
    }

    const data = await response.json()

    validateWeatherResponse(data, "mock")

    return {
        city: sanitizeData(data.city || city),
        temp: typeof data.temp === "number" ? data.temp : 0,
        feelsLike: typeof data.feelsLike === "number" ? data.feelsLike : 0,
        tempMin: typeof data.tempMin === "number" ? data.tempMin : 0,
        tempMax: typeof data.tempMax === "number" ? data.tempMax : 0,
        condition: sanitizeData(data.condition || "desconocido"),
        humidity: typeof data.humidity === "number" ? data.humidity : 0,
        pressure: typeof data.pressure === "number" ? data.pressure : 0,
        wind: typeof data.wind === "number" ? data.wind : 0,
        visibility: typeof data.visibility === "number" ? data.visibility : 0,
    }
}

async function fetchMockForecast(city: string): Promise<ForecastData[]> {
    return Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() + i * 86400000).toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
        }),
        tempMax: 20 + Math.random() * 10,
        tempMin: 10 + Math.random() * 5,
    }))
}

export async function fetchAllApis(city: string): Promise<Record<string, WeatherData | null>> {
    const results = await Promise.allSettled([
        fetchWeatherData(city, "openweather"),
        fetchWeatherData(city, "weatherapi"),
        fetchWeatherData(city, "mock"),
    ])

    return {
        OpenWeather: results[0].status === "fulfilled" ? results[0].value : null,
        WeatherAPI: results[1].status === "fulfilled" ? results[1].value : null,
        Mock: results[2].status === "fulfilled" ? results[2].value : null,
    }
}
