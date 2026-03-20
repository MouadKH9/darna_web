"use client"

import { Check, Clock, ChefHat, Truck, Package } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  { key: "pending", label: "En attente", icon: Clock },
  { key: "confirmed", label: "Confirmée", icon: Check },
  { key: "preparing", label: "En préparation", icon: ChefHat },
  { key: "ready", label: "Prête", icon: Package },
  { key: "delivering", label: "En livraison", icon: Truck },
  { key: "delivered", label: "Livrée", icon: Check },
]

interface OrderTimelineProps {
  currentStatus: string
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  if (currentStatus === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-4 text-destructive">
        <span className="font-medium">Commande annulée</span>
      </div>
    )
  }

  const currentIndex = steps.findIndex((s) => s.key === currentStatus)

  return (
    <div className="space-y-1">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex
        const isCurrent = index === currentIndex

        return (
          <div key={step.key} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                <step.icon className="h-4 w-4" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-6 w-0.5",
                    index < currentIndex ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-sm",
                isCurrent
                  ? "font-semibold text-primary"
                  : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
