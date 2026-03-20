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

      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Votre panier</h1>

        <div className="space-y-3">
          {cart.map((item, index) => (
            <CartItemCard
              key={`${item.dish.id}-${index}`}
              item={item}
              index={index}
              onQuantityChange={updateItemQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="mt-6">
          <CartSummary subtotal={getTotal()} />
        </div>

        <div className="mt-6">
          <Button render={<Link href={checkoutHref} />} className="w-full rounded-full gap-2" size="lg">
            Passer la commande
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
