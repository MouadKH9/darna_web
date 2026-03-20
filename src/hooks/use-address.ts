import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchRemoteAddress, upsertRemoteAddress } from "@/services/address-service"
import type { UserAddress } from "@/types"

export function useAddress(userId: string | undefined) {
  return useQuery({
    queryKey: ["address", userId],
    queryFn: () => fetchRemoteAddress(userId!),
    enabled: !!userId,
  })
}

export function useUpsertAddress(userId: string | undefined) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (address: UserAddress) => upsertRemoteAddress(userId!, address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["address", userId] })
    },
  })
}
