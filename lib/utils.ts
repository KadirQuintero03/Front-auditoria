import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "isomorphic-dompurify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ThreatDetection {
  hasThreat: boolean
  threatType: string[]
  originalValue: string
  sanitizedValue: string
}

/**
 * Detecta amenazas sin eliminarlas automáticamente (para auditoría)
 */
export function detectThreats(input: any): ThreatDetection {
  const threats: string[] = []
  const inputStr = String(input)

  // Detección de XSS
  if (/<script[^>]*>.*?<\/script>/gi.test(inputStr)) {
    threats.push("XSS: <script> tag detected")
  }
  if (/<iframe[^>]*>/gi.test(inputStr)) {
    threats.push("XSS: <iframe> tag detected")
  }
  if (/onerror\s*=/gi.test(inputStr)) {
    threats.push("XSS: onerror event handler")
  }
  if (/onload\s*=/gi.test(inputStr)) {
    threats.push("XSS: onload event handler")
  }
  if (/javascript:/gi.test(inputStr)) {
    threats.push("XSS: javascript: protocol")
  }
  if (/<svg[^>]*onload/gi.test(inputStr)) {
    threats.push("XSS: SVG with onload")
  }

  // Detección de SQL Injection
  if (/'\s*(OR|AND)\s*'.*'=/gi.test(inputStr) || /DROP\s+TABLE/gi.test(inputStr)) {
    threats.push("SQL Injection pattern detected")
  }

  // Detección de NoSQL Injection
  if (typeof input === 'object' && input !== null) {
    if ('$ne' in input || '$gt' in input || '$lt' in input) {
      threats.push("NoSQL Injection operator detected")
    }
  }

  // Detección de Path Traversal
  if (/\.\.[\/\\]/g.test(inputStr)) {
    threats.push("Path Traversal attempt")
  }

  // Detección de HTML Injection
  if (/<[^>]+style\s*=|<h1|<img|<a\s+href/gi.test(inputStr)) {
    threats.push("HTML Injection detected")
  }

  return {
    hasThreat: threats.length > 0,
    threatType: threats,
    originalValue: inputStr,
    sanitizedValue: sanitizeData(inputStr),
  }
}

/**
 * Sanitiza texto para prevenir XSS
 */
export function sanitizeData(input: string): string {
  if (typeof input !== "string") {
    return String(input)
  }

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
  const threat = detectThreats(jsonString)

  if (threat.hasThreat) {
    console.warn("[v0] ⚠️ AMENAZAS DETECTADAS en respuesta de:", source)
    console.warn("[v0] Tipos de amenaza:", threat.threatType)
  }

  console.log("[v0] ✅ Validación completada para:", source)
}

/**
 * Valida y sanitiza números
 */
export function sanitizeNumber(input: any, fallback = 0): number {
  const num = Number(input)

  // Detectar overflows
  if (!isNaN(num)) {
    if (!isFinite(num)) {
      console.warn("[v0] ⚠️ Overflow detectado: valor infinito")
      return fallback
    }
    if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
      console.warn("[v0] ⚠️ Overflow detectado: fuera de rango seguro")
      return fallback
    }
  }

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

/**
 * Valida tipos de datos
 */
export function validateType(value: any, expectedType: string, fieldName: string): boolean {
  const actualType = typeof value

  if (actualType !== expectedType) {
    console.warn(`[v0] ⚠️ Tipo incorrecto para ${fieldName}: esperado ${expectedType}, recibido ${actualType}`)
    return false
  }

  return true
}