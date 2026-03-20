"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { GuestBanner } from "@/components/auth/guest-banner"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { useAddress } from "@/hooks/use-address"
import { MapPin, ChevronRight, LogOut, Trash2, Mail, UserRound } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export default function AccountPage() {
  const { user, isAnonymous, signOut, deleteAccount } = useAuth()
  const { data: address, isLoading: addressLoading } = useAddress(user?.id)
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    toast.success("Déconnexion réussie")
    router.push("/")
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteAccount()
      toast.success("Compte supprimé")
      router.push("/")
    } catch {
      toast.error("Erreur lors de la suppression du compte")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">Mon compte</h1>

        <div className="mb-4">
          <GuestBanner />
        </div>

        <div className="space-y-4">
          {/* Profile info */}
          <div className="rounded-xl bg-card p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <UserRound className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">
                  {user?.user_metadata?.full_name || (isAnonymous ? "Invité" : user?.email?.split("@")[0])}
                </p>
                {user?.email && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <Link
            href="/account/address"
            className="flex items-center gap-3 rounded-xl bg-card p-4 shadow-sm transition-colors hover:bg-accent"
          >
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">Adresse de livraison</p>
              {addressLoading ? (
                <Skeleton className="mt-1 h-4 w-48" />
              ) : address ? (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {address.addressLine}, {address.city}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Ajouter une adresse
                </p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>

          <Separator />

          {/* Actions */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </Button>

            {!isAnonymous && (
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    />
                  }
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer mon compte
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Supprimer votre compte ?</DialogTitle>
                    <DialogDescription>
                      Cette action est irréversible. Toutes vos données seront supprimées.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting}>
                      {deleting ? "Suppression..." : "Supprimer"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </main>

      <MobileNav />
    </div>
  )
}
