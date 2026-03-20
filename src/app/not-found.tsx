import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <span className="text-6xl">🍽️</span>
      <h1 className="mt-6 text-3xl font-bold">Page introuvable</h1>
      <p className="mt-2 text-muted-foreground">
        La page que vous cherchez n&apos;existe pas.
      </p>
      <Button render={<Link href="/" />} className="mt-6 rounded-full">
        Retour au menu
      </Button>
    </div>
  )
}
