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
    console.log("[v0] Validando respuesta de:", source)

    if (!data || typeof data !== "object") {
        throw new Error(`Respuesta inválida de ${source}: no es un objeto`)
    }

    // Validación específica por fuente
    if (source === "openweather") {
        if (!data.main || !data.weather || !data.wind) {
            throw new Error("Respuesta de OpenWeather con campos faltantes")
        }
    } else if (source === "weatherapi") {
        if (!data.location || !data.current) {
            throw new Error("Respuesta de WeatherAPI con campos faltantes")
        }
    }

    // Detectar intentos de inyección
    const jsonString = JSON.stringify(data)
    if (jsonString.includes("<script>") || jsonString.includes("onerror=")) {
        console.warn("[v0] ⚠️ Intento de XSS detectado en respuesta de:", source)
    }

    console.log("[v0] Validación completada para:", source)
}

/**
 * Valida y sanitiza números
 */
export function sanitizeNumber(input: any, fallback = 0): number {
    const num = Number(input)
    return isNaN(num) ? fallback : num
}
