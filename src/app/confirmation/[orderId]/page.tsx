"use client"

import { use } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { useOrderDetail } from "@/hooks/use-orders"
import { formatPrice } from "@/utils/format"
import { Clock, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { springBouncy, fadeInUp, easeOutExpo } from "@/lib/animations"
import { PageTransition } from "@/components/layout/page-transition"

export default function ConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params)
  const { data: order, isLoading } = useOrderDetail(orderId)

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <PageTransition>
        <main className="mx-auto max-w-lg px-4 py-12">
          {isLoading ? (
            <div className="space-y-4 text-center">
              <Skeleton className="mx-auto h-16 w-16 rounded-full" />
              <Skeleton className="mx-auto h-8 w-48" />
              <Skeleton className="mx-auto h-5 w-64" />
            </div>
          ) : (
            <div className="text-center space-y-6">
              {/* Checkmark with path-draw animation and burst stars */}
              <div className="flex justify-center">
                <div className="relative">
                  <motion.svg
                    width="80" height="80" viewBox="0 0 80 80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-success"
                  >
                    <motion.circle
                      cx="40" cy="40" r="36"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    <motion.path
                      d="M24 40L35 51L56 30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4, delay: 0.6, ease: "easeInOut" }}
                    />
                  </motion.svg>

                  {/* Burst of Moroccan stars */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.div
                      key={angle}
                      className="absolute left-1/2 top-1/2 text-gold"
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: Math.cos((angle * Math.PI) / 180) * 50,
                        y: Math.sin((angle * Math.PI) / 180) * 50,
                        scale: [0, 1.2, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{ ...springBouncy, delay: 0.8 + i * 0.05, duration: 0.8 }}
                    >
                      <svg width="10" height="10" viewBox="0 0 12 12">
                        <path d="M6 0l1.5 4.5L12 6l-4.5 1.5L6 12 4.5 7.5 0 6l4.5-1.5Z" fill="currentColor"/>
                      </svg>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ ...easeOutExpo, delay: 0.5 }}
              >
                <h1 className="text-3xl font-bold font-display">Commande confirmée !</h1>
                <p className="mt-2 text-muted-foreground">
                  Merci pour votre commande. Nous préparons vos plats avec soin.
                </p>
              </motion.div>

              {order && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ ...easeOutExpo, delay: 0.7 }}
                  className="rounded-2xl bg-card p-6 card-warm-glow space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Temps estimé: <strong className="text-foreground">{order.estimatedTime} min</strong></span>
                  </div>
                  <div className="text-3xl font-display font-bold text-gradient-warm">
                    {formatPrice(order.total)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Commande #{orderId.slice(0, 8)}
                  </p>
                </motion.div>
              )}

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ ...easeOutExpo, delay: 0.9 }}
                className="flex flex-col gap-3 pt-4"
              >
                <Button render={<Link href={`/orders/${orderId}`} />} className="rounded-full gap-2 h-14">
                  Suivre ma commande
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" render={<Link href="/" />} className="rounded-full">
                  Retour au menu
                </Button>
              </motion.div>
            </div>
          )}
        </main>
      </PageTransition>

      <MobileNav />
    </div>
  )
}
