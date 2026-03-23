"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock } from "lucide-react"
import type { Zone } from "@/types"
import { motion } from "framer-motion"

interface ZoneSelectorProps {
  zones: Zone[]
  selected: string | undefined
  onSelect: (zoneId: string) => void
}

export function ZoneSelector({ zones, selected, onSelect }: ZoneSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Zone de livraison</h3>
      <RadioGroup value={selected} onValueChange={onSelect}>
        <div className="grid gap-2">
          {zones.map((zone) => (
            <motion.div key={zone.id} whileTap={{ scale: 0.98 }}>
              <Label
                htmlFor={zone.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-primary/30 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary/50 has-[[data-state=checked]]:bg-primary/5"
              >
                <RadioGroupItem value={zone.id} id={zone.id} />
                <div className="flex-1">
                  <span className="font-medium">{zone.name}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {zone.deliveryTimeMinutes} min
                </div>
              </Label>
            </motion.div>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
