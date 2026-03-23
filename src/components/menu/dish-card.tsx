"use client"

import Image from "next/image"
import Link from "next/link"
import { Clock } from "lucide-react"
import { formatPrice } from "@/utils/format"
import type { Dish } from "@/types"
import { motion } from "framer-motion"
import { fadeInUp, springGentle, easeOutExpo } from "@/lib/animations"

interface DishCardProps {
  dish: Dish
  index?: number
}

export function DishCard({ dish, index = 0 }: DishCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ ...easeOutExpo, delay: index * 0.06 }}
      whileHover={{ y: -6, transition: springGentle }}
    >
      <Link href={`/menu/${dish.id}`} className="group block">
        <div className="overflow-hidden rounded-3xl bg-card card-warm-glow transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden">
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

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Category badge — glassmorphism at bottom-left */}
            {dish.category && (
              <span className="absolute bottom-3 left-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium backdrop-blur-md">
                {dish.category}
              </span>
            )}

            {/* Prep time */}
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {dish.prepTimeMinutes} min
            </div>
          </div>

          {/* Floating price pill */}
          <div className="relative">
            <span className="absolute -top-4 right-4 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25">
              {formatPrice(dish.price)}
            </span>
          </div>

          {/* Info */}
          <div className="p-4 pt-6">
            <h3 className="font-display text-lg font-bold leading-snug text-card-foreground line-clamp-1">
              {dish.name}
            </h3>
            {dish.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                {dish.description}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
