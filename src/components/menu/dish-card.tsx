"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/utils/format"
import type { Dish } from "@/types"
import { motion } from "framer-motion"

interface DishCardProps {
  dish: Dish
  index?: number
}

export function DishCard({ dish, index = 0 }: DishCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/menu/${dish.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {dish.image ? (
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-warm dark:bg-warm">
                <span className="text-4xl">🍽️</span>
              </div>
            )}

            {/* Category badge */}
            {dish.category && (
              <Badge
                className="absolute left-3 top-3 border-0 bg-secondary/90 text-secondary-foreground backdrop-blur-sm"
              >
                {dish.category}
              </Badge>
            )}

            {/* Prep time */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {dish.prepTimeMinutes} min
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-display text-[17px] font-semibold leading-snug text-card-foreground line-clamp-1">
              {dish.name}
            </h3>
            {dish.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {dish.description}
              </p>
            )}
            <p className="mt-3 text-lg font-bold text-primary">
              {formatPrice(dish.price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
