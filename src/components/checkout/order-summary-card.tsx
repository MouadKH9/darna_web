"use client"

import Image from "next/image"
import type { CartItem } from "@/types"
import { formatPrice } from "@/utils/format"
import { Separator } from "@/components/ui/separator"

interface OrderSummaryCardProps {
  items: CartItem[]
  total: number
}

export function OrderSummaryCard({ items, total }: OrderSummaryCardProps) {
  return (
    <div className="space-y-3 rounded-xl bg-card p-4 shadow-sm">
      <h3 className="font-semibold">Récapitulatif</h3>
      <div className="space-y-3">
        {items.map((item, i) => {
          const extrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0)
          const lineTotal = (item.dish.price + extrasTotal) * item.quantity

          return (
            <div key={i} className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                {item.dish.image ? (
                  <Image src={item.dish.image} alt={item.dish.name} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-sm">🍽️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.dish.name}</p>
                <p className="text-xs text-muted-foreground">
                  x{item.quantity}
                  {item.extras.length > 0 && ` + ${item.extras.length} supp.`}
                </p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(lineTotal)}</span>
            </div>
          )
        })}
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
      </div>
    </div>
  )
}
