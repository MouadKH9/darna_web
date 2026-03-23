"use client"

import Link from "next/link"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, easeOutExpo } from "@/lib/animations"

export function GuestBanner() {
  const { isAnonymous } = useAuth()

  if (!isAnonymous) return null

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={easeOutExpo}
      className="relative overflow-hidden rounded-xl bg-primary/5 border border-primary/20 p-4"
    >
      {/* Warm shimmer on left edge */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/40 via-gold/40 to-primary/40" />

      <div className="flex items-center gap-3 pl-2">
        <UserPlus className="h-5 w-5 shrink-0 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Vous êtes en mode invité</p>
          <p className="text-xs text-muted-foreground">
            Créez un compte pour sauvegarder vos commandes
          </p>
        </div>
        <Button variant="outline" size="sm" render={<Link href="/auth/login" />} className="shrink-0 rounded-full">
          Créer un compte
        </Button>
      </div>
    </motion.div>
  )
}
