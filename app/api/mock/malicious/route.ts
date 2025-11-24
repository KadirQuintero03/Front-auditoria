import { NextResponse } from "next/server"

// Diferentes tipos de payloads maliciosos
const ATTACK_VECTORS = {
    xss_script: '<script>alert("XSS Attack")</script>',
    xss_img: '<img src=x onerror=alert("XSS")>',
    xss_svg: '<svg/onload=alert("XSS")>',
    xss_iframe: '<iframe src="javascript:alert(\'XSS\')">',
    sql_injection: "'; DROP TABLE weather;--",
    nosql_injection: { "$ne": null },
    html_injection: '<h1 style="color:red">HACKED</h1>',
    js_protocol: 'javascript:alert("XSS")',
    data_uri: 'data:text/html,<script>alert("XSS")</script>',
}

// Contador de requests para simular rate limiting
let requestCount = 0
let lastResetTime = Date.now()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const attackType = searchParams.get("attack") || "random"

    // Reset contador cada minuto
    if (Date.now() - lastResetTime > 60000) {
        requestCount = 0
        lastResetTime = Date.now()
    }

    requestCount++

    // Simular rate limiting (más de 10 requests por minuto)
    if (requestCount > 10) {
        return NextResponse.json(
            { error: "Too Many Requests - Rate limit exceeded" },
            { status: 429 }
        )
    }

    // Simular diferentes escenarios de ataque
    switch (attackType) {
        case "xss":
            return xssAttack()
        case "overflow":
            return overflowAttack()
        case "type-confusion":
            return typeConfusionAttack()
        case "incomplete":
            return incompleteDataAttack()
        case "delay":
            return await delayAttack()
        case "error":
            return errorResponse()
        case "mixed":
            return mixedAttack()
        default:
            return randomAttack()
    }
}

// 1. Ataque XSS puro
function xssAttack() {
    return NextResponse.json({
        message: {
            city: ATTACK_VECTORS.xss_script + "Madrid",
            temp: ATTACK_VECTORS.xss_img,
            feelsLike: 20,
            tempMin: 18,
            tempMax: 25,
            condition: ATTACK_VECTORS.xss_svg + "Soleado",
            humidity: 65,
            pressure: 1013,
            wind: 15,
            visibility: 10000,
            country: ATTACK_VECTORS.html_injection,
            icon: ATTACK_VECTORS.js_protocol,
        }
    })
}

// 2. Ataque de Overflow numérico
function overflowAttack() {
    return NextResponse.json({
        message: {
            city: "Madrid",
            temp: 9999999999999999999, // Overflow
            feelsLike: Number.MAX_SAFE_INTEGER,
            tempMin: -Infinity,
            tempMax: Infinity,
            condition: "Soleado",
            humidity: 9999999, // Imposible (debería ser 0-100)
            pressure: -5000, // Presión negativa
            wind: 999999, // Viento imposible
            visibility: Number.POSITIVE_INFINITY,
            country: "ES",
        }
    })
}

// 3. Confusión de tipos
function typeConfusionAttack() {
    return NextResponse.json({
        message: {
            city: ["Madrid", "Barcelona"], // Array en vez de string
            temp: "veinte grados", // String en vez de número
            feelsLike: null,
            tempMin: undefined,
            tempMax: { value: 25, unit: "celsius" }, // Objeto en vez de número
            condition: 404, // Número en vez de string
            humidity: "alta", // String en vez de número
            pressure: true, // Boolean en vez de número
            wind: [10, 15, 20], // Array en vez de número
            visibility: "10km", // String en vez de número
            country: 123, // Número en vez de string
        }
    })
}

// 4. Datos incompletos / campos faltantes
function incompleteDataAttack() {
    return NextResponse.json({
        message: {
            city: "Madrid",
            // temp: falta intencionalmente
            feelsLike: 20,
            // tempMin: falta
            // tempMax: falta
            // condition: falta
            humidity: 65,
            // pressure: falta
            wind: 15,
            // visibility: falta
        }
    })
}

// 5. Ataque de latencia (DoS simulado)
async function delayAttack() {
    // Delay de 5 segundos para probar timeout
    await new Promise(resolve => setTimeout(resolve, 5000))

    return NextResponse.json({
        message: {
            city: "Madrid",
            temp: 22,
            feelsLike: 20,
            tempMin: 18,
            tempMax: 25,
            condition: "Delayed Response Attack",
            humidity: 65,
            pressure: 1013,
            wind: 15,
            visibility: 10000,
        }
    })
}

// 6. Respuesta de error HTTP
function errorResponse() {
    const errors = [
        { status: 500, message: "Internal Server Error - Simulated Crash" },
        { status: 403, message: "Forbidden - Access Denied" },
        { status: 401, message: "Unauthorized - Invalid Credentials" },
        { status: 503, message: "Service Unavailable - Server Down" },
    ]

    const error = errors[Math.floor(Math.random() * errors.length)]
    return NextResponse.json({ error: error.message }, { status: error.status })
}

// 7. Ataque mixto (combina varios vectores)
function mixedAttack() {
    return NextResponse.json({
        message: {
            city: ATTACK_VECTORS.xss_script + "Madrid",
            temp: "99999" + ATTACK_VECTORS.xss_img, // XSS + overflow
            feelsLike: null,
            tempMin: undefined,
            tempMax: ATTACK_VECTORS.html_injection,
            condition: ATTACK_VECTORS.sql_injection,
            humidity: -999,
            pressure: "high" + ATTACK_VECTORS.xss_svg,
            wind: [ATTACK_VECTORS.xss_iframe],
            visibility: { evil: ATTACK_VECTORS.data_uri },
            country: ATTACK_VECTORS.nosql_injection,
            maliciousField: '<iframe src="evil.com"></iframe>',
            _id: { "$gt": "" }, // NoSQL injection
            exploit: "../../etc/passwd", // Path traversal
        }
    })
}

// 8. Ataque aleatorio
function randomAttack() {
    const attacks = [
        xssAttack,
        overflowAttack,
        typeConfusionAttack,
        incompleteDataAttack,
        errorResponse,
        mixedAttack,
    ]

    const randomAttackFn = attacks[Math.floor(Math.random() * attacks.length)]
    return randomAttackFn()
}