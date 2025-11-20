"use client"

import { useState, useEffect } from "react"

export function useTheme() {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem("theme")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        setIsDark(stored === "dark" || (!stored && prefersDark))
    }, [])

    const toggleTheme = () => {
        setIsDark((prev) => {
            const newValue = !prev
            localStorage.setItem("theme", newValue ? "dark" : "light")
            return newValue
        })
    }

    return { isDark, toggleTheme }
}
