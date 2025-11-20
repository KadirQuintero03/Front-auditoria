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
        borderColor: "hsl(var(--chart-1))",
        backgroundColor: "hsla(var(--chart-1) / 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Temperatura Mínima (°C)",
        data: data.map((d) => d.tempMin),
        borderColor: "hsl(var(--chart-2))",
        backgroundColor: "hsla(var(--chart-2) / 0.1)",
        fill: true,
        tension: 0.4,
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
          color: "hsl(var(--foreground))",
          font: {
            family: "Geist",
          },
        },
      },
      tooltip: {
        backgroundColor: "hsl(var(--card))",
        titleColor: "hsl(var(--foreground))",
        bodyColor: "hsl(var(--foreground))",
        borderColor: "hsl(var(--border))",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: {
          color: "hsla(var(--border) / 0.5)",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
        },
      },
      x: {
        grid: {
          color: "hsla(var(--border) / 0.5)",
        },
        ticks: {
          color: "hsl(var(--muted-foreground))",
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
      <Card className="p-6 bg-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Pronóstico Semanal</h3>
        <div className="h-80">
          <Line data={chartData} options={options} />
        </div>
      </Card>
    </motion.div>
  )
}
