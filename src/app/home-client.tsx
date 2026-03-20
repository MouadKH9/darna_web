"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Footer } from "@/components/layout/footer"
import { DishGrid } from "@/components/menu/dish-grid"
import { CategoryTabs } from "@/components/menu/category-tabs"
import { GuestBanner } from "@/components/auth/guest-banner"
import { useDishes } from "@/hooks/use-dishes"
import type { Dish } from "@/types"
import { motion } from "framer-motion"

interface HomeClientProps {
  initialDishes: Dish[]
}

export function HomeClient({ initialDishes }: HomeClientProps) {
  const { data: dishes } = useDishes()
  const allDishes = dishes ?? initialDishes

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = new Set(allDishes.map((d) => d.category).filter(Boolean) as string[])
    return Array.from(cats).sort()
  }, [allDishes])

  const filteredDishes = useMemo(() => {
    if (!selectedCategory) return allDishes
    return allDishes.filter((d) => d.category === selectedCategory)
  }, [allDishes, selectedCategory])

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-warm/50 dark:bg-warm/30">
          {/* Zellige pattern overlay */}
          <div className="absolute inset-0 bg-zellige opacity-60" />

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-secondary/5 blur-2xl" />

          <div className="relative mx-auto max-w-5xl px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl"
            >
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-primary/80">
                Fait maison avec amour
              </span>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
                Saveurs{" "}
                <span className="italic text-primary">marocaines</span>
                ,<br />
                livrées chez vous
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                Découvrez nos plats traditionnels préparés avec passion.
                Commandez en quelques clics et recevez votre repas rapidement.
              </p>
            </motion.div>

            {/* Decorative Moroccan star */}
            <motion.div
              initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-8 top-1/2 hidden -translate-y-1/2 md:block"
              aria-hidden
            >
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="text-primary/10">
                <path d="M60 0L74.5 45.5L120 60L74.5 74.5L60 120L45.5 74.5L0 60L45.5 45.5Z" fill="currentColor"/>
              </svg>
            </motion.div>
          </div>

          {/* Scalloped divider */}
          <div className="divider-scallop" />
        </section>

        {/* Menu */}
        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="mb-5">
            <GuestBanner />
          </div>

          <div className="mb-8">
            <div className="mb-5 flex items-baseline gap-3">
              <h2 className="text-2xl font-bold md:text-3xl">Notre Menu</h2>
              <span className="text-sm text-muted-foreground">
                {filteredDishes.length} plat{filteredDishes.length !== 1 ? "s" : ""}
              </span>
            </div>
            <CategoryTabs
              categories={categories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          <DishGrid dishes={filteredDishes} />
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
