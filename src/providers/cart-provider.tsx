"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useState } from "react"
import type { CartItem, Dish, Extra } from "@/types"
import { createClient } from "@/lib/supabase/client"
import type { PostgrestError } from "@supabase/supabase-js"
import { toast } from "sonner"
import { useAuth } from "./auth-provider"
import { fetchRemoteAddress } from "@/services/address-service"

interface CartContextType {
  cart: CartItem[]
  addToCart: (dish: Dish, quantity: number, extras: Extra[]) => void
  clearCart: () => void
  getTotal: () => number
  updateItemQuantity: (index: number, quantity: number) => void
  removeItem: (index: number) => void
  placeOrder: (paymentMethod: "cash" | "card") => Promise<{ orderId: string; estimatedTime: number } | null>
}

const CART_STORAGE_KEY = "darna-cart"

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const { user, isAnonymous } = useAuth()

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setCart(JSON.parse(stored))
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true)
  }, [])

  // Persist cart to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    }
  }, [cart, hydrated])

  const addToCart = useCallback((dish: Dish, quantity: number, extras: Extra[]) => {
    const newItem: CartItem = { dish, quantity, extras }
    setCart((prev) => [...prev, newItem])
  }, [])

  const updateItemQuantity = useCallback((index: number, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index)
      }
      return prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    })
  }, [])

  const removeItem = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => {
      const dishTotal = item.dish.price * item.quantity
      const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.price, 0) * item.quantity
      return total + dishTotal + extrasTotal
    }, 0)
  }, [cart])

  const placeOrder = useCallback(async (paymentMethod: "cash" | "card") => {
    if (cart.length === 0) return null

    if (!user) {
      toast.error("Vous devez être connecté pour passer une commande.")
      return null
    }

    const supabase = createClient()
    const total = getTotal()

    let estimatedTime = 35
    try {
      const address = await fetchRemoteAddress(user.id)
      const maxPrepTime = Math.max(...cart.map((item) => item.dish.prepTimeMinutes))
      const zoneDeliveryTime = address?.zone?.deliveryTimeMinutes ?? 15
      estimatedTime = maxPrepTime + zoneDeliveryTime
    } catch {
      // Use default if address fetch fails
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          is_guest: isAnonymous,
          total,
          status: "pending",
          payment_method: paymentMethod,
          estimated_time: estimatedTime,
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItemsPayload = cart.map((item) => {
        const dishTotal = item.dish.price
        const extrasTotal = item.extras.reduce((sum, extra) => sum + extra.price, 0)
        const unitPrice = dishTotal + extrasTotal

        return {
          order_id: order.id,
          dish_id: item.dish.id,
          quantity: item.quantity,
          unit_price: unitPrice,
          line_total: unitPrice * item.quantity,
        }
      })

      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsPayload)
        .select()

      if (itemsError) throw itemsError

      const extrasPayload =
        orderItems?.flatMap((orderItem, index) => {
          const cartItem = cart[index]
          return cartItem.extras.map((extra) => ({
            order_item_id: orderItem.id,
            extra_id: extra.id,
            unit_price: extra.price,
          }))
        }) ?? []

      if (extrasPayload.length > 0) {
        const { error: extrasError } = await supabase.from("order_item_extras").insert(extrasPayload)
        if (extrasError) throw extrasError
      }

      clearCart()
      return { orderId: order.id as string, estimatedTime }
    } catch (error) {
      const supabaseError = error as PostgrestError
      console.error("Error placing order", supabaseError)
      toast.error("Une erreur est survenue lors de la création de la commande.")
      return null
    }
  }, [cart, user, isAnonymous, getTotal, clearCart])

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, getTotal, updateItemQuantity, removeItem, placeOrder }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
