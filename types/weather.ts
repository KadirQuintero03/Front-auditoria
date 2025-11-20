export interface WeatherData {
    city: string
    temp: number
    feelsLike: number
    tempMin: number
    tempMax: number
    condition: string
    humidity: number
    pressure: number
    wind: number
    visibility: number
}

export interface ForecastData {
    date: string
    tempMax: number
    tempMin: number
}

export interface AuditLog {
    id: string
    timestamp: string
    message: string
    status: "success" | "warning" | "error"
    latency: number
}
