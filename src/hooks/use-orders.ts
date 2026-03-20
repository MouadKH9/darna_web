import { useQuery } from "@tanstack/react-query"
import { fetchOrders, fetchOrderDetail } from "@/services/order-service"

export function useOrders(userId: string | undefined) {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => fetchOrders(userId!),
    enabled: !!userId,
  })
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetail(orderId),
    enabled: !!orderId,
  })
}
