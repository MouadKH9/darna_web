"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingBag, ClipboardList, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/providers/cart-provider"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/cart", label: "Panier", icon: ShoppingBag },
  { href: "/orders", label: "Commandes", icon: ClipboardList },
  { href: "/account", label: "Compte", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()
  const { cart } = useCart()
  const { user } = useAuth()

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 backdrop-blur-lg md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          const href =
            item.href === "/account" && !user
              ? "/auth/login"
              : item.href

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.href === "/cart" && (
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        key="mobile-cart-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
              </div>
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-px left-2 right-2 h-0.5 rounded-full bg-primary"
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
