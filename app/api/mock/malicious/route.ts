import { NextResponse } from "next/server"

export async function GET() {
    // Simulación de respuesta maliciosa para pruebas de seguridad
    const maliciousData = {
        // XSS attempt
        city: '<script>alert("XSS")</script>Madrid',
        temp: 22,
        feelsLike: 20,
        tempMin: 18,
        tempMax: 25,
        // Intento de inyección en texto
        condition: 'Soleado<img src=x onerror=alert("XSS")>',
        humidity: 65,
        pressure: 1013,
        wind: 15,
        visibility: 10000,
        // Campo corrupto
        maliciousField: '<iframe src="evil.com"></iframe>',
        // Datos numéricos corruptos
        fakeTemp: "not-a-number",
        // Campos faltantes simulados en otros escenarios
        missingField: undefined,
    }

    // Simular latencia
    await new Promise((resolve) => setTimeout(resolve, 200))

    return NextResponse.json(maliciousData)
}
