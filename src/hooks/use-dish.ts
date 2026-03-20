import { useQuery } from "@tanstack/react-query"
import { fetchExtrasForDish } from "@/services/menu-service"

export function useDishExtras(dishId: string) {
  return useQuery({
    queryKey: ["dish-extras", dishId],
    queryFn: () => fetchExtrasForDish(dishId),
    enabled: !!dishId,
  })
}
