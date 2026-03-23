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
import { easeOutExpo } from "@/lib/animations"
import { ArrowDown } from "lucide-react"

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

  const scrollToMenu = () => {
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-warm/50 dark:bg-warm/30 min-h-[85vh] md:min-h-[70vh] flex items-center">
          {/* Layered background */}
          <div className="absolute inset-0 bg-arch-gradient" />
          <div className="absolute inset-0 bg-zellige-bold" style={{ maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)", WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)" }} />

          {/* Floating decorative stars */}
          <div className="absolute right-[10%] top-[15%] text-primary/10" aria-hidden style={{ animation: "float 6s ease-in-out infinite" }}>
            <svg width="32" height="32" viewBox="0 0 12 12"><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5Z" fill="currentColor"/></svg>
          </div>
          <div className="absolute left-[8%] bottom-[25%] text-primary/8" aria-hidden style={{ animation: "float 8s ease-in-out infinite 1s" }}>
            <svg width="20" height="20" viewBox="0 0 12 12"><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5Z" fill="currentColor"/></svg>
          </div>
          <div className="absolute right-[25%] bottom-[20%] text-gold/15" aria-hidden style={{ animation: "float 7s ease-in-out infinite 2s" }}>
            <svg width="24" height="24" viewBox="0 0 12 12"><path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5Z" fill="currentColor"/></svg>
          </div>

          {/* Decorative arch frame SVG */}
          <motion.svg
            className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block text-primary/15"
            width="200" height="280" viewBox="0 0 200 280" fill="none"
            aria-hidden
          >
            <motion.path
              d="M10 280V140C10 68 45 10 100 10C155 10 190 68 190 140V280"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            />
          </motion.svg>

          {/* Decorative blurs */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-secondary/5 blur-2xl" />

          <div className="relative mx-auto max-w-5xl px-4 py-16 md:py-24">
            <div className="max-w-xl">
              {/* Subheading */}
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...easeOutExpo, delay: 0 }}
                className="mb-5 inline-block text-sm font-semibold uppercase tracking-[0.3em] text-primary/80"
              >
                Fait maison avec amour
              </motion.span>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...easeOutExpo, delay: 0.2 }}
                className="text-display-xl font-bold leading-[1.05]"
              >
                Saveurs{" "}
                <span className="italic text-gradient-warm">marocaines</span>
                ,<br />
                livrées chez vous
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...easeOutExpo, delay: 0.4 }}
                className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
              >
                Découvrez nos plats traditionnels préparés avec passion.
                Commandez en quelques clics et recevez votre repas rapidement.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...easeOutExpo, delay: 0.6 }}
                className="mt-8"
              >
                <motion.button
                  onClick={scrollToMenu}
                  whileHover={{ y: 3 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
                >
                  Voir le menu
                  <ArrowDown className="h-4 w-4" />
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Scalloped divider */}
          <div className="absolute bottom-0 left-0 right-0 divider-scallop" />
        </section>

        {/* Menu */}
        <motion.section
          id="menu-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={easeOutExpo}
          className="mx-auto max-w-5xl px-4 py-10"
        >
          <div className="mb-5">
            <GuestBanner />
          </div>

          <div className="mb-8">
            <div className="mb-5 flex items-baseline gap-3">
              <h2 className="text-3xl font-bold font-display md:text-4xl">
                Notre Menu
                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-gold align-middle" />
              </h2>
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-sm font-medium text-primary">
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
        </motion.section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  )
}
