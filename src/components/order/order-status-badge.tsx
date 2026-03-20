import { Badge } from "@/components/ui/badge"
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface OrderStatusBadgeProps {
  status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("border-0", ORDER_STATUS_COLORS[status] ?? "")}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
