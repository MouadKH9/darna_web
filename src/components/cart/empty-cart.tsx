"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { fadeInScale, easeOutExpo } from "@/lib/animations"

export function EmptyCart() {
  return (
    <motion.div
      variants={fadeInScale}
      initial="hidden"
      animate="visible"
      transition={easeOutExpo}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {/* Decorative tagine SVG */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-muted-foreground/30">
        <path d="M40 8C40 8 20 20 20 40C20 45 21 50 24 54H56C59 50 60 45 60 40C60 20 40 8 40 8Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <ellipse cx="40" cy="58" rx="24" ry="6" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M16 58C16 58 14 64 14 66C14 70 26 74 40 74C54 74 66 70 66 66C66 64 64 58 64 58" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="40" cy="8" r="3" fill="currentColor"/>
      </svg>
      <h2 className="mt-6 text-xl font-display font-semibold">Votre panier est vide</h2>
      <p className="mt-2 text-muted-foreground">
        Parcourez notre menu et ajoutez vos plats préférés
      </p>
      <Button render={<Link href="/" />} className="mt-6 rounded-full px-8">
        Voir le menu
      </Button>
    </motion.div>
  )
}
