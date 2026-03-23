"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, User, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useCart } from "@/providers/cart-provider"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { springBouncy, fadeInScale } from "@/lib/animations"

export function Header() {
  const { cart } = useCart()
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <motion.div
          variants={fadeInScale}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Darna" width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="font-display text-3xl font-bold italic tracking-tight text-gradient-warm">
              Darna
            </span>
          </Link>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Changer le thème</span>
          </Button>

          {/* Account */}
          <Button variant="ghost" size="icon" render={<Link href={user ? "/account" : "/auth/login"} />} className="text-muted-foreground hover:text-foreground">
            <User className="h-5 w-5" />
            <span className="sr-only">Compte</span>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" render={<Link href="/cart" />} className="relative text-muted-foreground hover:text-foreground">
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={springBouncy}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground ring-2 ring-background"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="sr-only">Panier</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
