import { createClient } from "@/lib/supabase/client"
import type { OrderDetail, OrderItemDetail, OrderItemExtra } from "@/types"

export interface OrderSummary {
  id: string
  status: string
  total: number
  createdAt: string
  itemCount: number
}

export const fetchOrders = async (userId: string): Promise<OrderSummary[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      total,
      created_at,
      order_items (id)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  if (!data) return []

  return data.map((order) => ({
    id: order.id,
    status: order.status,
    total: Number(order.total),
    createdAt: order.created_at,
    itemCount: Array.isArray(order.order_items) ? order.order_items.length : 0,
  }))
}

export const fetchOrderDetail = async (orderId: string): Promise<OrderDetail | null> => {
  const supabase = createClient()

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single()

  if (orderError || !order) return null

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      id,
      dish_id,
      quantity,
      unit_price,
      line_total,
      dishes (name, image_url)
    `)
    .eq("order_id", orderId)

  if (itemsError) throw itemsError

  const orderItems: OrderItemDetail[] = await Promise.all(
    (items ?? []).map(async (item) => {
      const { data: extras } = await supabase
        .from("order_item_extras")
        .select(`
          id,
          extra_id,
          unit_price,
          extras (name)
        `)
        .eq("order_item_id", item.id)

      const dish = item.dishes as unknown as { name: string; image_url: string } | null

      const orderExtras: OrderItemExtra[] = (extras ?? []).map((e) => ({
        id: e.id,
        extraId: e.extra_id,
        extraName: (e.extras as unknown as { name: string } | null)?.name ?? "",
        unitPrice: Number(e.unit_price),
      }))

      return {
        id: item.id,
        dishId: item.dish_id,
        dishName: dish?.name ?? "Plat inconnu",
        dishImage: dish?.image_url ?? "",
        quantity: item.quantity,
        unitPrice: Number(item.unit_price),
        lineTotal: Number(item.line_total),
        extras: orderExtras,
      }
    })
  )

  return {
    id: order.id,
    status: order.status,
    total: Number(order.total),
    estimatedTime: order.estimated_time ?? 35,
    paymentMethod: order.payment_method ?? "cash",
    isGuest: order.is_guest ?? false,
    createdAt: order.created_at,
    items: orderItems,
  }
}
