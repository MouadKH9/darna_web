"use client"

import { use } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { useOrderDetail } from "@/hooks/use-orders"
import { formatPrice } from "@/utils/format"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export default function ConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params)
  const { data: order, isLoading } = useOrderDetail(orderId)

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <main className="mx-auto max-w-lg px-4 py-12">
        {isLoading ? (
          <div className="space-y-4 text-center">
            <Skeleton className="mx-auto h-16 w-16 rounded-full" />
            <Skeleton className="mx-auto h-8 w-48" />
            <Skeleton className="mx-auto h-5 w-64" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="h-20 w-20 text-success" />
              </motion.div>
            </div>

            <div>
              <h1 className="text-2xl font-bold">Commande confirmée !</h1>
              <p className="mt-2 text-muted-foreground">
                Merci pour votre commande. Nous préparons vos plats avec soin.
              </p>
            </div>

            {order && (
              <div className="rounded-xl bg-card p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Temps estimé: <strong className="text-foreground">{order.estimatedTime} min</strong></span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(order.total)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Commande #{orderId.slice(0, 8)}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <Button render={<Link href={`/orders/${orderId}`} />} className="rounded-full gap-2">
                Suivre ma commande
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" render={<Link href="/" />} className="rounded-full">
                Retour au menu
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <MobileNav />
    </div>
  )
}
