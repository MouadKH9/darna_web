"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ZoneSelector } from "@/components/checkout/zone-selector"
import { AddressForm } from "@/components/checkout/address-form"
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector"
import { OrderSummaryCard } from "@/components/checkout/order-summary-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/providers/cart-provider"
import { useAuth } from "@/providers/auth-provider"
import { useZones } from "@/hooks/use-zones"
import { useAddress } from "@/hooks/use-address"
import { upsertRemoteAddress } from "@/services/address-service"
import { isValidMoroccanPhone } from "@/utils/phone"
import type { UserAddress } from "@/types"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getTotal, placeOrder } = useCart()
  const { user } = useAuth()
  const { data: zones, isLoading: zonesLoading } = useZones()
  const { data: savedAddress, isLoading: addressLoading } = useAddress(user?.id)

  const [address, setAddress] = useState<UserAddress>({
    addressLine: "",
    city: "",
    phone: "",
    zoneId: undefined,
  })
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [errors, setErrors] = useState<Partial<Record<keyof UserAddress, string>>>({})
  const [submitting, setSubmitting] = useState(false)

  // Pre-fill from saved address
  useEffect(() => {
    if (savedAddress) {
      setAddress({
        addressLine: savedAddress.addressLine,
        city: savedAddress.city,
        phone: savedAddress.phone,
        zoneId: savedAddress.zoneId,
      })
    }
  }, [savedAddress])

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.replace("/cart")
    }
  }, [cart, router])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserAddress, string>> = {}

    if (!address.phone.trim()) {
      newErrors.phone = "Le téléphone est obligatoire"
    } else if (!isValidMoroccanPhone(address.phone)) {
      newErrors.phone = "Numéro marocain invalide"
    }

    if (!address.addressLine.trim()) {
      newErrors.addressLine = "L'adresse est obligatoire"
    }

    if (!address.city.trim()) {
      newErrors.city = "La ville est obligatoire"
    }

    if (!address.zoneId) {
      toast.error("Veuillez sélectionner une zone de livraison")
      return false
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate() || !user) return

    setSubmitting(true)
    try {
      // Save address
      await upsertRemoteAddress(user.id, address)

      // Place order
      const result = await placeOrder(paymentMethod)
      if (result) {
        router.push(`/confirmation/${result.orderId}`)
      }
    } catch {
      toast.error("Une erreur est survenue")
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0) return null

  const isLoading = zonesLoading || addressLoading

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Finaliser la commande</h1>

        <div className="space-y-6">
          {/* Zone selector */}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          ) : (
            <ZoneSelector
              zones={zones ?? []}
              selected={address.zoneId}
              onSelect={(zoneId) => setAddress((prev) => ({ ...prev, zoneId }))}
            />
          )}

          {/* Address form */}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          ) : (
            <AddressForm
              address={address}
              onChange={setAddress}
              errors={errors}
            />
          )}

          {/* Payment */}
          <PaymentMethodSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />

          {/* Order summary */}
          <OrderSummaryCard items={cart} total={getTotal()} />

          {/* Submit */}
          <Button
            className="w-full rounded-full"
            size="lg"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmer la commande
          </Button>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
