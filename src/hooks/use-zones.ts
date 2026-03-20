import { useQuery } from "@tanstack/react-query"
import { fetchZones } from "@/services/address-service"

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: fetchZones,
  })
}
