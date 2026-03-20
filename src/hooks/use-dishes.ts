import { useQuery } from "@tanstack/react-query"
import { fetchDishes } from "@/services/menu-service"

export function useDishes() {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: fetchDishes,
  })
}
