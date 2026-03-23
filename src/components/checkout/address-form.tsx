"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { UserAddress } from "@/types"

interface AddressFormProps {
  address: UserAddress
  onChange: (address: UserAddress) => void
  errors?: Partial<Record<keyof UserAddress, string>>
}

export function AddressForm({ address, onChange, errors }: AddressFormProps) {
  const update = (field: keyof UserAddress, value: string) => {
    onChange({ ...address, [field]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Coordonnées de livraison</h3>

      <div className="space-y-2">
        <Label htmlFor="city">Ville</Label>
        <Input
          id="city"
          placeholder="Ville"
          value={address.city}
          onChange={(e) => update("city", e.target.value)}
        />
        {errors?.city && (
          <p className="text-sm text-destructive">{errors.city}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="0612345678"
          value={address.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
        {errors?.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>
    </div>
  )
}
