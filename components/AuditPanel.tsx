"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Activity, Clock, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import type { AuditLog } from "@/types/weather"

interface AuditPanelProps {
  logs: AuditLog[]
}

export default function AuditPanel({ logs }: AuditPanelProps) {
  const latestLogs = logs.slice(-5).reverse()

  const stats = {
    total: logs.length,
    success: logs.filter((l) => l.status === "success").length,
    error: logs.filter((l) => l.status === "error").length,
    threats: logs.filter((l) => l.status === "threat").length,
    avgLatency: logs.length > 0 ? Math.round(logs.reduce((sum, l) => sum + l.latency, 0) / logs.length) : 0,
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
      <Card className="p-4 bg-card h-full">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Panel de Auditoría</h3>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="p-3 rounded-lg bg-accent/10">
            <p className="text-xs text-muted-foreground mb-1">Latencia Media</p>
            <p className="text-2xl font-bold text-foreground">{stats.avgLatency}ms</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
            <CheckCircle2 className="w-4 h-4 text-chart-2" />
            <div>
              <p className="text-xs text-muted-foreground">Exitosos</p>
              <p className="text-lg font-semibold text-foreground">{stats.success}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
            <XCircle className="w-4 h-4 text-destructive" />
            <div>
              <p className="text-xs text-muted-foreground">Errores</p>
              <p className="text-lg font-semibold text-foreground">{stats.error}</p>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Últimos eventos</p>
          {latestLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No hay eventos aún</p>
          ) : (
            latestLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 p-2 rounded-lg bg-secondary/30 border border-border"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {log.status === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-chart-2" />
                  ) : log.status === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-chart-4" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground font-medium truncate">{log.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{log.latency}ms</span>
                    <span className="text-xs text-muted-foreground">• {log.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Card>
    </motion.div>
  )
}
