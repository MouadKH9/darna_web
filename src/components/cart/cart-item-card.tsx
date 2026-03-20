"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuantityControl } from "@/components/menu/quantity-control"
import { formatPrice } from "@/utils/format"
import type { CartItem } from "@/types"

interface CartItemCardProps {
  item: CartItem
  index: number
  onQuantityChange: (index: number, quantity: number) => void
  onRemove: (index: number) => void
}

export function CartItemCard({ item, index, onQuantityChange, onRemove }: CartItemCardProps) {
  const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.price, 0)
  const lineTotal = (item.dish.price + extrasTotal) * item.quantity

  return (
    <div className="flex gap-4 rounded-xl bg-card p-4 shadow-sm">
      {/* Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
        {item.dish.image ? (
          <Image
            src={item.dish.image}
            alt={item.dish.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-2xl">🍽️</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <h3 className="font-semibold line-clamp-1">{item.dish.name}</h3>
          {item.extras.length > 0 && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              + {item.extras.map((e) => e.name).join(", ")}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <QuantityControl
            value={item.quantity}
            onChange={(q) => onQuantityChange(index, q)}
          />
          <p className="text-sm font-bold text-primary">
            {formatPrice(lineTotal)}
          </p>
        </div>
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        className="shrink-0 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
