import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">Votre panier est vide</h2>
      <p className="mt-2 text-muted-foreground">
        Parcourez notre menu et ajoutez vos plats préférés
      </p>
      <Button render={<Link href="/" />} className="mt-6 rounded-full px-8">
        Voir le menu
      </Button>
    </div>
  )
}
