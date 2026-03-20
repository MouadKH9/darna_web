import { createClient } from "@/lib/supabase/client"
import type { UserAddress, Zone } from "@/types"

export const fetchZones = async (): Promise<Zone[]> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("zones")
    .select("id, name, is_active, delivery_time_minutes")
    .eq("is_active", true)
    .order("name")

  if (error) throw error

  return (data ?? []).map((zone) => ({
    id: zone.id,
    name: zone.name,
    isActive: zone.is_active,
    deliveryTimeMinutes: zone.delivery_time_minutes,
  }))
}

export const fetchRemoteAddress = async (userId: string): Promise<UserAddress | null> => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("user_addresses")
    .select(`
      address_line,
      city,
      phone,
      zone_id,
      zones (
        id,
        name,
        is_active,
        delivery_time_minutes
      )
    `)
    .eq("user_id", userId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const zoneData = data.zones as unknown as { id: string; name: string; is_active: boolean; delivery_time_minutes: number } | null

  return {
    addressLine: data.address_line,
    city: data.city,
    phone: data.phone,
    zoneId: data.zone_id ?? undefined,
    zone: zoneData
      ? {
        id: zoneData.id,
        name: zoneData.name,
        isActive: zoneData.is_active,
        deliveryTimeMinutes: zoneData.delivery_time_minutes,
      }
      : undefined,
  }
}

export const upsertRemoteAddress = async (userId: string, address: UserAddress): Promise<void> => {
  const supabase = createClient()

  const { error: addressError } = await supabase
    .from("user_addresses")
    .upsert(
      {
        user_id: userId,
        address_line: address.addressLine,
        city: address.city,
        phone: address.phone,
        zone_id: address.zoneId ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )

  if (addressError) throw addressError

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        phone: address.phone,
      },
      { onConflict: "id" },
    )

  if (profileError) {
    console.error("Error updating profile phone:", profileError)
  }
}
