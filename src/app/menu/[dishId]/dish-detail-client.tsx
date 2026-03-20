"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ExtrasSelector } from "@/components/menu/extras-selector"
import { QuantityControl } from "@/components/menu/quantity-control"
import { useDishExtras } from "@/hooks/use-dish"
import { useCart } from "@/providers/cart-provider"
import { formatPrice } from "@/utils/format"
import type { Dish, Extra } from "@/types"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

interface DishDetailClientProps {
  dish: Dish
}

export function DishDetailClient({ dish }: DishDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])
  const { data: extras, isLoading: extrasLoading } = useDishExtras(dish.id)
  const { addToCart } = useCart()
  const router = useRouter()

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0)
  const total = (dish.price + extrasTotal) * quantity

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    )
  }

  const handleAddToCart = () => {
    addToCart(dish, quantity, selectedExtras)
    toast.success(`${dish.name} ajouté au panier`)
    router.push("/")
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Header />

      <main className="mx-auto max-w-3xl">
        {/* Back button */}
        <div className="px-4 pt-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

        {/* Hero image */}
        <div className="relative mx-4 mt-2 aspect-[16/10] overflow-hidden rounded-2xl">
          {dish.image ? (
            <Image
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 px-4 py-6"
        >
          {/* Title & price */}
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              {dish.prepTimeMinutes} min de préparation
            </div>
            <h1 className="text-2xl font-bold">{dish.name}</h1>
            {dish.description && (
              <p className="mt-2 text-muted-foreground">{dish.description}</p>
            )}
            <p className="mt-3 text-2xl font-bold text-primary">
              {formatPrice(dish.price)}
            </p>
          </div>

          {/* Extras */}
          {extrasLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </div>
          ) : extras && extras.length > 0 ? (
            <ExtrasSelector
              extras={extras}
              selected={selectedExtras}
              onToggle={toggleExtra}
            />
          ) : null}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-semibold">Quantité</h3>
            <QuantityControl value={quantity} onChange={setQuantity} />
          </div>
        </motion.div>

        {/* Sticky add-to-cart bar */}
        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border/50 bg-background/90 p-4 backdrop-blur-lg md:bottom-0">
          <div className="mx-auto flex max-w-3xl items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-primary">{formatPrice(total)}</p>
            </div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="rounded-full px-8 gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5" />
                Ajouter au panier
              </Button>
            </motion.div>
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
