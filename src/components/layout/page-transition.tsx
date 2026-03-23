"use client"

import { motion } from "framer-motion"
import { easeOutExpo } from "@/lib/animations"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={easeOutExpo}
    >
      {children}
    </motion.div>
  )
}
