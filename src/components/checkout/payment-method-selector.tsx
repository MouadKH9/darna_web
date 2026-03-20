"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Banknote, CreditCard } from "lucide-react"

interface PaymentMethodSelectorProps {
  selected: "cash" | "card"
  onSelect: (method: "cash" | "card") => void
}

const methods = [
  { value: "cash" as const, label: "Espèces", icon: Banknote, description: "Paiement à la livraison" },
  { value: "card" as const, label: "Carte bancaire", icon: CreditCard, description: "Paiement en ligne" },
]

export function PaymentMethodSelector({ selected, onSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Mode de paiement</h3>
      <RadioGroup value={selected} onValueChange={(v) => onSelect(v as "cash" | "card")}>
        <div className="grid gap-2">
          {methods.map((method) => (
            <Label
              key={method.value}
              htmlFor={`pay-${method.value}`}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 transition-colors hover:border-primary/30 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <RadioGroupItem value={method.value} id={`pay-${method.value}`} />
              <method.icon className="h-5 w-5 text-muted-foreground" />
              <div>
                <span className="font-medium">{method.label}</span>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </div>
            </Label>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}
