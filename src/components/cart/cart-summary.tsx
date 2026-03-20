"use client"

import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/utils/format"

interface CartSummaryProps {
  subtotal: number
  deliveryFee?: number
}

export function CartSummary({ subtotal, deliveryFee = 0 }: CartSummaryProps) {
  const total = subtotal + deliveryFee

  return (
    <div className="space-y-3 rounded-xl bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Sous-total</span>
        <span className="font-medium">{formatPrice(subtotal)}</span>
      </div>
      {deliveryFee > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Livraison</span>
          <span className="font-medium">{formatPrice(deliveryFee)}</span>
        </div>
      )}
      <Separator />
      <div className="flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
      </div>
    </div>
  )
}
