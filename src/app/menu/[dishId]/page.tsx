import { createClient } from "@/lib/supabase/server"
import { fetchDishByIdServer } from "@/services/menu-service"
import { DishDetailClient } from "./dish-detail-client"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ dishId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { dishId } = await params
  const supabase = await createClient()
  const dish = await fetchDishByIdServer(supabase as ReturnType<typeof import("@/lib/supabase/client").createClient>, dishId)

  if (!dish) return { title: "Plat introuvable" }

  return {
    title: `${dish.name} — Darna`,
    description: dish.description ?? `Commandez ${dish.name} chez Darna`,
    openGraph: {
      title: dish.name,
      description: dish.description ?? `Commandez ${dish.name} chez Darna`,
      images: dish.image ? [dish.image] : [],
    },
  }
}

export default async function DishDetailPage({ params }: Props) {
  const { dishId } = await params
  const supabase = await createClient()
  const dish = await fetchDishByIdServer(supabase as ReturnType<typeof import("@/lib/supabase/client").createClient>, dishId)

  if (!dish) notFound()

  return <DishDetailClient dish={dish} />
}
