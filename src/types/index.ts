export interface Dish {
  id: string
  name: string
  description?: string
  price: number
  image: string
  prepTimeMinutes: number
  rating?: number
  category?: string
}

export interface Extra {
  id: string
  name: string
  price: number
  image: string
}

export interface Zone {
  id: string
  name: string
  isActive: boolean
  deliveryTimeMinutes: number
}

export interface CartItem {
  dish: Dish
  quantity: number
  extras: Extra[]
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  estimatedTime: number
}

export interface UserAddress {
  addressLine: string
  city: string
  phone: string
  zoneId?: string
  zone?: Zone
}

export interface OrderDetail {
  id: string
  status: string
  total: number
  estimatedTime: number
  paymentMethod: string
  isGuest: boolean
  createdAt: string
  items: OrderItemDetail[]
}

export interface OrderItemDetail {
  id: string
  dishId: string
  dishName: string
  dishImage: string
  quantity: number
  unitPrice: number
  lineTotal: number
  extras: OrderItemExtra[]
}

export interface OrderItemExtra {
  id: string
  extraId: string
  extraName: string
  unitPrice: number
}
