"use client"

import { use } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { OrderStatusBadge } from "@/components/order/order-status-badge"
import { OrderTimeline } from "@/components/order/order-timeline"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrderDetail } from "@/hooks/use-orders"
import { formatPrice, formatDate } from "@/utils/format"
import { PAYMENT_METHOD_LABELS } from "@/lib/constants"
import { ArrowLeft, Clock } from "lucide-react"

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params)
  const { data: order, isLoading } = useOrderDetail(orderId)
  const router = useRouter()

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4 gap-1">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-60 rounded-xl" />
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">Commande</h1>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                #{orderId.slice(0, 8)} &middot; {formatDate(order.createdAt)}
              </p>
            </div>

            {/* Estimated time */}
            <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-4 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>Temps estimé: <strong>{order.estimatedTime} min</strong></span>
              <span className="text-muted-foreground">&middot;</span>
              <span>{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</span>
            </div>

            {/* Timeline */}
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="mb-4 font-semibold">Suivi</h3>
              <OrderTimeline currentStatus={order.status} />
            </div>

            {/* Items */}
            <div className="rounded-xl bg-card p-4 shadow-sm">
              <h3 className="mb-4 font-semibold">Articles</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                      {item.dishImage ? (
                        <Image src={item.dishImage} alt={item.dishName} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-sm">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.dishName}</p>
                      {item.extras.length > 0 && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          + {item.extras.map((e) => e.extraName).join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">Commande introuvable</p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  )
}
