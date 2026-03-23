"use client"

import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { OrderCard } from "@/components/order/order-card"
import { GuestBanner } from "@/components/auth/guest-banner"
import { useAuth } from "@/providers/auth-provider"
import { useOrders } from "@/hooks/use-orders"
import { Skeleton } from "@/components/ui/skeleton"
import { ClipboardList } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, easeOutExpo } from "@/lib/animations"
import { PageTransition } from "@/components/layout/page-transition"

export default function OrdersPage() {
  const { user } = useAuth()
  const { data: orders, isLoading } = useOrders(user?.id)

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <PageTransition>
        <main className="mx-auto max-w-2xl px-4 py-6">
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={easeOutExpo}
            className="mb-6 text-3xl font-bold font-display"
          >
            Mes commandes
          </motion.h1>

          <div className="mb-4">
            <GuestBanner />
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ClipboardList className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="mt-6 text-xl font-display font-semibold">Aucune commande</h2>
              <p className="mt-2 text-muted-foreground">
                Vos commandes apparaîtront ici
              </p>
            </div>
          )}
        </main>
      </PageTransition>

      <MobileNav />
    </div>
  )
}
