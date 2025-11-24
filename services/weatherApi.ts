import { sanitizeData, validateWeatherResponse } from "../utils/sanitize"
import type { WeatherData, ForecastData, WeatherAPIResponse, OpenWeatherAPIResponse, OpenWeatherCurrentResponse } from "../types/weather"

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://lq3p60dt-3000.use2.devtunnels.ms"
const WEATHER_API_ENDPOINT = process.env.NEXT_PUBLIC_WEATHER_API_ENDPOINT || "/api/weather"
const OPENWEATHER_API_ENDPOINT = process.env.NEXT_PUBLIC_OPENWEATHER_API_ENDPOINT || "/api/openWeather"

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

    // Por ahora retornamos datos mock para el forecast
    // Puedes implementar endpoints específicos en el backend más adelante
    return fetchMockForecast(city)
}

async function fetchWeatherApiData(city: string): Promise<WeatherData> {
    const url = `${BACKEND_BASE}${WEATHER_API_ENDPOINT}/${encodeURIComponent(city)}`

    console.log("[v0] Calling WeatherAPI:", url)

    const response = await fetch(url, {
        headers: { Accept: "application/json" },
    })

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
    }

    const data: WeatherAPIResponse = await response.json()

    validateWeatherResponse(data, "weatherapi")

    const { location, current } = data.message

    return {
        city: sanitizeData(location.name),
        country: sanitizeData(location.country),
        lat: location.lat,
        lon: location.lon,
        temp: current.temp_c ?? 0,
        feelsLike: current.feelslike_c ?? 0,
        tempMin: current.temp_c ?? 0, // WeatherAPI no proporciona min/max en current
        tempMax: current.temp_c ?? 0,
        condition: sanitizeData(current.condition?.text ?? "desconocido"),
        icon: current.condition?.icon,
        humidity: current.humidity ?? 0,
        pressure: current.pressure_mb ?? 0,
        wind: current.wind_kph ?? 0,
        windDirection: sanitizeData(current.wind_dir ?? ""),
        cloudiness: current.cloud ?? 0,
        visibility: current.vis_km ? current.vis_km * 1000 : 0,
        uv: current.uv ?? 0,
    }
}

async function fetchOpenWeather(city: string): Promise<WeatherData> {
    const url = `${BACKEND_BASE}${OPENWEATHER_API_ENDPOINT}/${encodeURIComponent(city)}`

    console.log("[v0] Calling OpenWeather:", url)

    const response = await fetch(url, {
        headers: { Accept: "application/json" },
    })

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`)
    }

    const data: OpenWeatherCurrentResponse = await response.json()

    validateWeatherResponse(data, "openweather-current")

    const { message } = data
    const tempCelsius = message.main.temp - 273.15 // Convertir Kelvin a Celsius
    const feelsLikeCelsius = message.main.feels_like - 273.15
    const tempMinCelsius = message.main.temp_min - 273.15
    const tempMaxCelsius = message.main.temp_max - 273.15

    return {
        city: sanitizeData(message.name),
        country: sanitizeData(message.sys.country),
        lat: message.coord.lat,
        lon: message.coord.lon,
        temp: tempCelsius,
        feelsLike: feelsLikeCelsius,
        tempMin: tempMinCelsius,
        tempMax: tempMaxCelsius,
        condition: sanitizeData(message.weather[0]?.description ?? "desconocido"),
        icon: message.weather[0]?.icon ? `https://openweathermap.org/img/wn/${message.weather[0].icon}@2x.png` : undefined,
        humidity: message.main.humidity ?? 0,
        pressure: message.main.pressure ?? 0,
        wind: message.wind.speed ? message.wind.speed * 3.6 : 0, // Convertir m/s a km/h
        windDirection: message.wind.deg ? getWindDirection(message.wind.deg) : undefined,
        cloudiness: message.clouds?.all ?? 0,
        visibility: message.visibility ?? 0,
    }
}

// Función auxiliar para convertir grados a dirección del viento
function getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
}

async function fetchMockWeather(city: string): Promise<WeatherData> {
    // Simulamos una respuesta
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
        city: sanitizeData(city),
        country: "Mock",
        temp: 20 + Math.random() * 15,
        feelsLike: 18 + Math.random() * 15,
        tempMin: 15 + Math.random() * 5,
        tempMax: 25 + Math.random() * 10,
        condition: "Soleado",
        humidity: 50 + Math.random() * 30,
        pressure: 1000 + Math.random() * 30,
        wind: 5 + Math.random() * 20,
        visibility: 8000 + Math.random() * 2000,
        cloudiness: Math.random() * 100,
        uv: Math.random() * 10,
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
        fetchWeatherData(city, "weatherapi"),
        fetchWeatherData(city, "openweather"),
        fetchWeatherData(city, "mock"),
    ])

    return {
        WeatherAPI: results[0].status === "fulfilled" ? results[0].value : null,
        OpenWeather: results[1].status === "fulfilled" ? results[1].value : null,
        Mock: results[2].status === "fulfilled" ? results[2].value : null,
    }
}