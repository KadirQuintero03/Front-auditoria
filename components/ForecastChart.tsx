"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import type { ForecastData } from "@/types/weather"
import { Loader2 } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface ForecastChartProps {
  data: ForecastData[]
  isLoading: boolean
}

export default function ForecastChart({ data, isLoading }: ForecastChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6 bg-card">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pronóstico Semanal</h3>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No hay datos de pronóstico disponibles</p>
        </div>
      </Card>
    )
  }

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Temperatura Máxima (°C)",
        data: data.map((d) => d.tempMax),
        borderColor: "#ff6b6b", // Mejor contraste
        backgroundColor: "rgba(255, 107, 107, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Temperatura Mínima (°C)",
        data: data.map((d) => d.tempMin),
        borderColor: "#4dabf7", // Mejor contraste
        backgroundColor: "rgba(77, 171, 247, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#e6e6e6", // Texto claro
          font: {
            family: "Geist",
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(30, 30, 30, 0.9)",
        titleColor: "#fff",
        bodyColor: "#ddd",
        borderColor: "#444",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#b3b3b3",
          font: {
            size: 13,
          },
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#b3b3b3",
          font: {
            size: 13,
          },
        },
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="p-6 bg-card border border-white/10 shadow-xl">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pronóstico Semanal</h3>
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </Card>
    </motion.div>
  )
}
