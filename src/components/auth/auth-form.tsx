"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import { Loader2, UserRound } from "lucide-react"

type Mode = "login" | "signup"

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)

  const { signIn, signUp, signInAnonymously, isAnonymous, signInAndMigrateAnonymousData, linkEmailIdentity } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "login") {
        if (isAnonymous) {
          await signInAndMigrateAnonymousData(email, password)
        } else {
          await signIn(email, password)
        }
        toast.success("Connexion réussie")
        router.push(redirect)
      } else {
        if (isAnonymous) {
          await linkEmailIdentity(email, password, fullName || undefined)
          toast.success("Compte créé avec succès")
          router.push(redirect)
        } else {
          const { needsEmailConfirmation } = await signUp(email, password, fullName || undefined)
          if (needsEmailConfirmation) {
            toast.success("Vérifiez votre email pour confirmer votre compte")
          } else {
            toast.success("Compte créé avec succès")
            router.push(redirect)
          }
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = async () => {
    setGuestLoading(true)
    try {
      await signInAnonymously()
      toast.success("Bienvenue !")
      router.push(redirect)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(message)
    } finally {
      setGuestLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">Darna</h1>
        <p className="mt-2 text-muted-foreground">
          {mode === "login" ? "Connectez-vous à votre compte" : "Créez votre compte"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Votre nom"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "login" ? "Se connecter" : "Créer un compte"}
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-sm text-primary hover:underline"
        >
          {mode === "login"
            ? "Pas encore de compte ? S'inscrire"
            : "Déjà un compte ? Se connecter"}
        </button>
      </div>

      {!isAnonymous && (
        <>
          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              ou
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={handleGuest}
            disabled={guestLoading}
          >
            {guestLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserRound className="mr-2 h-4 w-4" />
            )}
            Continuer en tant qu&apos;invité
          </Button>
        </>
      )}
    </div>
  )
}
