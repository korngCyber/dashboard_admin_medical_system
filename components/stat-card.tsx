import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: string
    positive: boolean
    label: string
  }
  className?: string
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-50" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 p-1.5 text-primary">{icon}</div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={cn("flex items-center", trend.positive ? "text-emerald-500" : "text-rose-500")}>
              {trend.value}
            </span>{" "}
            {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

