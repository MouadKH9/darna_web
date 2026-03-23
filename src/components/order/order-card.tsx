"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { OrderStatusBadge } from "./order-status-badge"
import { formatPrice, formatRelativeTime } from "@/utils/format"
import type { OrderSummary } from "@/services/order-service"
import { motion } from "framer-motion"
import { fadeInUp, easeOutExpo } from "@/lib/animations"

interface OrderCardProps {
  order: OrderSummary
}

const statusBorderColor: Record<string, string> = {
  pending: "border-l-primary",
  confirmed: "border-l-primary",
  preparing: "border-l-primary",
  ready: "border-l-primary",
  delivering: "border-l-primary",
  delivered: "border-l-success",
  cancelled: "border-l-destructive",
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ x: 4 }}
      transition={easeOutExpo}
    >
      <Link
        href={`/orders/${order.id}`}
        className={`flex items-center gap-4 rounded-2xl border-l-4 bg-card p-4 card-warm-glow transition-colors hover:bg-accent ${statusBorderColor[order.status] ?? "border-l-border"}`}
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
    </motion.div>
  )
}
