"use client"

import { AlertCircle, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ErrorBannerProps {
  message: string
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border-2 border-destructive/50"
      >
        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
        <p className="text-sm text-destructive font-medium flex-1">{message}</p>
        <button
          onClick={() => setIsVisible(false)}
          className="flex items-center justify-center w-6 h-6 rounded hover:bg-destructive/20 transition-colors"
        >
          <X className="w-4 h-4 text-destructive" />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
