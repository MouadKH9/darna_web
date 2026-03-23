"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { AddressForm } from "@/components/checkout/address-form"
import { ZoneSelector } from "@/components/checkout/zone-selector"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { useAddress, useUpsertAddress } from "@/hooks/use-address"
import { useZones } from "@/hooks/use-zones"
import { isValidMoroccanPhone } from "@/utils/phone"
import type { UserAddress } from "@/types"
import { toast } from "sonner"
import { ArrowLeft, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, easeOutExpo } from "@/lib/animations"
import { PageTransition } from "@/components/layout/page-transition"

export default function AddressPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { data: savedAddress, isLoading: addressLoading } = useAddress(user?.id)
  const { data: zones, isLoading: zonesLoading } = useZones()
  const upsertAddress = useUpsertAddress(user?.id)

  const [address, setAddress] = useState<UserAddress>({
    addressLine: "",
    city: "Tanger",
    phone: "",
    zoneId: undefined,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof UserAddress, string>>>({})

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

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UserAddress, string>> = {}

    if (!address.phone.trim()) {
      newErrors.phone = "Le téléphone est obligatoire"
    } else if (!isValidMoroccanPhone(address.phone)) {
      newErrors.phone = "Numéro marocain invalide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return

    try {
      await upsertAddress.mutateAsync(address)
      toast.success("Adresse enregistrée")
      router.back()
    } catch {
      toast.error("Erreur lors de l'enregistrement")
    }
  }

  const isLoading = addressLoading || zonesLoading

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <PageTransition>
        <main className="mx-auto max-w-2xl px-4 py-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>

          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={easeOutExpo}
            className="mb-6 text-3xl font-bold font-display"
          >
            Adresse de livraison
          </motion.h1>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-60 rounded-xl" />
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} transition={easeOutExpo}>
                <ZoneSelector
                  zones={zones ?? []}
                  selected={address.zoneId}
                  onSelect={(zoneId) => setAddress((prev) => ({ ...prev, zoneId }))}
                />
              </motion.div>

              <motion.div variants={fadeInUp} transition={easeOutExpo}>
                <AddressForm
                  address={address}
                  onChange={setAddress}
                  errors={errors}
                />
              </motion.div>

              <motion.div variants={fadeInUp} transition={easeOutExpo}>
                <Button
                  className="w-full rounded-full"
                  size="lg"
                  onClick={handleSave}
                  disabled={upsertAddress.isPending}
                >
                  {upsertAddress.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </Button>
              </motion.div>
            </motion.div>
          )}
        </main>
      </PageTransition>

      <MobileNav />
    </div>
  )
}
