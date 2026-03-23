"use client"

import Link from "next/link"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { CartItemCard } from "@/components/cart/cart-item-card"
import { CartSummary } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"
import { Button } from "@/components/ui/button"
import { useCart } from "@/providers/cart-provider"
import { useAuth } from "@/providers/auth-provider"
import { ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, staggerContainer, easeOutExpo, springBouncy } from "@/lib/animations"
import { PageTransition } from "@/components/layout/page-transition"

export default function CartPage() {
  const { cart, getTotal, updateItemQuantity, removeItem } = useCart()
  const { user } = useAuth()

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pb-20 md:pb-0">
        <Header />
        <EmptyCart />
        <MobileNav />
      </div>
    )
  }

  const checkoutHref = user ? "/checkout" : "/auth/login?redirect=/checkout"

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <PageTransition>
        <main className="mx-auto max-w-2xl px-4 py-6">
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={easeOutExpo}
            className="mb-6 text-3xl font-bold font-display"
          >
            Votre panier
          </motion.h1>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.dish.id}-${index}`}
                  variants={fadeInUp}
                  exit={{ opacity: 0, x: -200, height: 0, marginBottom: 0 }}
                  transition={easeOutExpo}
                  layout
                >
                  <CartItemCard
                    item={item}
                    index={index}
                    onQuantityChange={updateItemQuantity}
                    onRemove={removeItem}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="mt-6">
            <CartSummary subtotal={getTotal()} />
          </div>

          <div className="mt-6">
            <motion.div whileTap={{ scale: 0.98 }} transition={springBouncy}>
              <Button render={<Link href={checkoutHref} />} className="w-full rounded-full gap-2 h-14" size="lg">
                Passer la commande
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <MobileNav />
    </div>
  )
}
