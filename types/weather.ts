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
    country?: string
    lat?: number
    lon?: number
    windDirection?: string
    cloudiness?: number
    uv?: number
    icon?: string
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

// Respuestas del backend
export interface WeatherAPIResponse {
    message: {
        location: {
            name: string
            country: string
            lat: number
            lon: number
            region: string
            tz_id: string
            localtime: string
        }
        current: {
            temp_c: number
            feelslike_c: number
            condition: {
                text: string
                icon: string
                code: number
            }
            wind_kph: number
            wind_dir: string
            humidity: number
            cloud: number
            pressure_mb: number
            vis_km: number
            uv: number
        }
    }
}

export interface OpenWeatherLocation {
    name: string
    lat: number
    lon: number
    country: string
    state?: string
}

export interface OpenWeatherAPIResponse {
    message: OpenWeatherLocation[]
}

// Países disponibles
export interface Country {
    name: string
    code: string
}