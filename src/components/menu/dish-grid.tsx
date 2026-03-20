"use client"

import type { Dish } from "@/types"
import { DishCard } from "./dish-card"

interface DishGridProps {
  dishes: Dish[]
}

export function DishGrid({ dishes }: DishGridProps) {
  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl">🍽️</span>
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          Aucun plat disponible pour le moment
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {dishes.map((dish, index) => (
        <DishCard key={dish.id} dish={dish} index={index} />
      ))}
    </div>
  )
}
