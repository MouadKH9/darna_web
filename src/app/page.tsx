import { createClient } from "@/lib/supabase/server"
import { fetchDishesServer } from "@/services/menu-service"
import { HomeClient } from "./home-client"
import type { Dish } from "@/types"

export default async function HomePage() {
  let dishes: Dish[] = []
  try {
    const supabase = await createClient()
    dishes = await fetchDishesServer(supabase as ReturnType<typeof import("@/lib/supabase/client").createClient>)
  } catch {
    // Will show empty state
  }

  return <HomeClient initialDishes={dishes} />
}
