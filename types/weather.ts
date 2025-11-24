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
    message: string
    status: "success" | "warning" | "error" | "threat"
    latency: number
    timestamp: string

    // ➕ agrega estos:
    apiSource: "openweather" | "weatherapi" | "mock"
    threats?: string[]
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

// Respuesta del endpoint de clima actual de OpenWeather
export interface OpenWeatherCurrentResponse {
    message: {
        coord: {
            lon: number
            lat: number
        }
        weather: Array<{
            id: number
            main: string
            description: string
            icon: string
        }>
        base: string
        main: {
            temp: number // Kelvin
            feels_like: number // Kelvin
            temp_min: number // Kelvin
            temp_max: number // Kelvin
            pressure: number
            humidity: number
            sea_level?: number
            grnd_level?: number
        }
        visibility: number
        wind: {
            speed: number // m/s
            deg: number
            gust?: number
        }
        clouds: {
            all: number
        }
        dt: number
        sys: {
            type: number
            id: number
            country: string
            sunrise: number
            sunset: number
        }
        timezone: number
        id: number
        name: string
        cod: number
    }
}

// Países disponibles
export interface Country {
    name: string
    code: string
}