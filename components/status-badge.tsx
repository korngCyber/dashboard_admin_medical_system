import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
  variant?: "product" | "order"
}

export function StatusBadge({ status, variant = "product" }: StatusBadgeProps) {
  if (variant === "product") {
    return (
      <Badge
        variant={status === "in-stock" ? "success" : status === "low-stock" ? "warning" : "destructive"}
        className="px-3 py-1 capitalize"
      >
        {status}
      </Badge>
    )
  }

  // Order status badges
  return (
    <Badge
      variant={
        status === "delivered"
          ? "success"
          : status === "shipped"
            ? "info"
            : status === "processing"
              ? "secondary"
              : status === "pending"
                ? "warning"
                : "destructive"
      }
      className="px-3 py-1 capitalize"
    >
      {status}
    </Badge>
  )
}

