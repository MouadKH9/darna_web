"use client"

import { Check, Clock, ChefHat, Truck, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { springBouncy } from "@/lib/animations"

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
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.4 }}
            className="flex items-center gap-3"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...springBouncy, delay: index * 0.15 }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground",
                  isCurrent && "animate-[pulse-warm_2s_ease-in-out_infinite]"
                )}
              >
                <step.icon className="h-4 w-4" />
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.15 + 0.1, duration: 0.3 }}
                  style={{ transformOrigin: "top" }}
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
          </motion.div>
        )
      })}
    </div>
  )
}
