"use client"

import type { Dish } from "@/types"
import { DishCard } from "./dish-card"
import { motion } from "framer-motion"
import { staggerContainer } from "@/lib/animations"

interface DishGridProps {
  dishes: Dish[]
}

export function DishGrid({ dishes }: DishGridProps) {
  if (dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        {/* Decorative tagine SVG */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-muted-foreground/30">
          <path d="M40 8C40 8 20 20 20 40C20 45 21 50 24 54H56C59 50 60 45 60 40C60 20 40 8 40 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <ellipse cx="40" cy="58" rx="24" ry="6" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M16 58C16 58 14 64 14 66C14 70 26 74 40 74C54 74 66 70 66 66C66 64 64 58 64 58" stroke="currentColor" strokeWidth="2" fill="none"/>
          <circle cx="40" cy="8" r="3" fill="currentColor"/>
        </svg>
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          Aucun plat disponible pour le moment
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {dishes.map((dish, index) => (
        <DishCard key={dish.id} dish={dish} index={index} />
      ))}
    </motion.div>
  )
}
