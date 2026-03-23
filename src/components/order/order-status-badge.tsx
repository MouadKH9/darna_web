import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface OrderStatusBadgeProps {
  status: string
}

const activeStatuses = new Set(["pending", "confirmed", "preparing", "ready", "delivering"])

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-0 gap-1.5", ORDER_STATUS_COLORS[status] ?? "")}
    >
      {activeStatuses.has(status) && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {ORDER_STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
