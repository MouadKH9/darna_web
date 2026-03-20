"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/utils/format"
import type { Extra } from "@/types"

interface ExtrasSelectorProps {
  extras: Extra[]
  selected: Extra[]
  onToggle: (extra: Extra) => void
}

export function ExtrasSelector({ extras, selected, onToggle }: ExtrasSelectorProps) {
  if (extras.length === 0) return null

  const isSelected = (extra: Extra) =>
    selected.some((e) => e.id === extra.id)

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Suppléments</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {extras.map((extra) => {
          const active = isSelected(extra)
          return (
            <button
              key={extra.id}
              onClick={() => onToggle(extra)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                active
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              {extra.image && (
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={extra.image}
                    alt={extra.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{extra.name}</p>
                <p className="text-sm text-primary font-semibold">
                  +{formatPrice(extra.price)}
                </p>
              </div>
              <div
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border"
                )}
              >
                {active && <Check className="h-3 w-3" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
