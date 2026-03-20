import type { Dish, Extra } from "@/types"
import { createClient } from "@/lib/supabase/client"

export const fetchDishes = async (): Promise<Dish[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  if (error) throw error
  if (!data) return []

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: Number(row.price),
    image: row.image_url,
    prepTimeMinutes: row.prep_time_minutes ?? 30,
    category: row.category ?? undefined,
  }))
}

export const fetchExtrasForDish = async (dishId: string): Promise<Extra[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("dish_extras")
    .select("extras:extra_id (id, name, price, image_url)")
    .eq("dish_id", dishId)

  if (error) throw error
  if (!data) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[])
    .map((row) => row.extras)
    .filter(Boolean)
    .map((extra: { id: string; name: string; price: number; image_url: string }) => ({
      id: extra.id,
      name: extra.name,
      price: Number(extra.price),
      image: extra.image_url,
    }))
}

// Server-side fetch for SSR
export const fetchDishesServer = async (supabase: ReturnType<typeof createClient>): Promise<Dish[]> => {
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  if (error) throw error
  if (!data) return []

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: Number(row.price),
    image: row.image_url,
    prepTimeMinutes: row.prep_time_minutes ?? 30,
    category: row.category ?? undefined,
  }))
}

export const fetchDishByIdServer = async (supabase: ReturnType<typeof createClient>, dishId: string): Promise<Dish | null> => {
  const { data, error } = await supabase
    .from("dishes")
    .select("*")
    .eq("id", dishId)
    .eq("is_active", true)
    .single()

  if (error) return null
  if (!data) return null

  return {
    id: data.id,
    name: data.name,
    description: data.description ?? undefined,
    price: Number(data.price),
    image: data.image_url,
    prepTimeMinutes: data.prep_time_minutes ?? 30,
    category: data.category ?? undefined,
  }
}
