"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { OrderStatusBadge } from "./order-status-badge"
import { formatPrice, formatRelativeTime } from "@/utils/format"
import type { OrderSummary } from "@/services/order-service"

interface OrderCardProps {
  order: OrderSummary
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-sm transition-colors hover:bg-accent"
    >
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(order.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {order.itemCount} {order.itemCount === 1 ? "article" : "articles"}
        </p>
        <p className="font-bold text-primary">{formatPrice(order.total)}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </Link>
  )
}
