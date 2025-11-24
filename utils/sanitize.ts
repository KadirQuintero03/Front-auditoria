import DOMPurify from "isomorphic-dompurify"

/**
 * Sanitiza texto para prevenir XSS
 */
export function sanitizeData(input: string): string {
    if (typeof input !== "string") {
        console.warn("[v0] Sanitize: Input no es string:", typeof input)
        return String(input)
    }

    // Eliminar cualquier HTML/scripts maliciosos
    const clean = DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    })

    return clean.trim()
}

/**
 * Valida que la respuesta de la API tenga la estructura esperada
 */
export function validateWeatherResponse(data: any, source: string): void {
    console.log("[v0] Validando respuesta de:", source, data)

    if (!data || typeof data !== "object") {
        throw new Error(`Respuesta inválida de ${source}: no es un objeto`)
    }

    // Validación específica por fuente
    if (source === "openweather") {
        if (!data.message || !Array.isArray(data.message)) {
            throw new Error("Respuesta de OpenWeather con formato inválido")
        }
        if (data.message.length === 0) {
            throw new Error("OpenWeather no devolvió resultados")
        }
    } else if (source === "openweather-current") {
        if (!data.message) {
            throw new Error("Respuesta de OpenWeather sin campo 'message'")
        }
        if (!data.message.main) {
            throw new Error("Respuesta de OpenWeather sin datos meteorológicos")
        }
        if (!data.message.coord) {
            throw new Error("Respuesta de OpenWeather sin coordenadas")
        }
    } else if (source === "weatherapi") {
        if (!data.message) {
            throw new Error("Respuesta de WeatherAPI sin campo 'message'")
        }
        if (!data.message.location) {
            throw new Error("Respuesta de WeatherAPI sin campo 'location'")
        }
        if (!data.message.current) {
            throw new Error("Respuesta de WeatherAPI sin campo 'current'")
        }
    } else if (source === "mock") {
        console.log("[v0] Mock data - validación básica")
    }

    // Detectar intentos de inyección
    const jsonString = JSON.stringify(data)
    if (jsonString.includes("<script>") || jsonString.includes("onerror=")) {
        console.warn("[v0] ⚠️ Intento de XSS detectado en respuesta de:", source)
    }

    console.log("[v0] ✅ Validación completada para:", source)
}

/**
 * Valida y sanitiza números
 */
export function sanitizeNumber(input: any, fallback = 0): number {
    const num = Number(input)
    return isNaN(num) ? fallback : num
}

/**
 * Valida rangos numéricos
 */
export function validateRange(value: number, min: number, max: number, fieldName: string): void {
    if (value < min || value > max) {
        console.warn(`[v0] ⚠️ Valor fuera de rango para ${fieldName}: ${value} (esperado: ${min}-${max})`)
    }
}