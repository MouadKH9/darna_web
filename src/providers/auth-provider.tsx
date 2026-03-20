"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAnonymous: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInAndMigrateAnonymousData: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ needsEmailConfirmation: boolean }>
  signInAnonymously: () => Promise<void>
  linkEmailIdentity: (email: string, password: string, fullName?: string) => Promise<User | null>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const isAnonymous = user?.is_anonymous ?? false

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    void init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        if (newSession?.user) {
          void ensureProfileExists(newSession.user)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ensureProfileExists = async (authUser: User) => {
    try {
      const fullName = authUser.user_metadata?.full_name ?? authUser.email?.split("@")[0] ?? null

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", authUser.id)
        .maybeSingle()

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          id: authUser.id,
          full_name: fullName,
          is_guest: authUser.is_anonymous ?? false,
        })
      } else {
        const updates: { is_guest?: boolean; full_name?: string } = {}

        if (!authUser.is_anonymous) {
          updates.is_guest = false
        }

        if (fullName && !existingProfile.full_name) {
          updates.full_name = fullName
        }

        if (Object.keys(updates).length > 0) {
          await supabase
            .from("profiles")
            .update(updates)
            .eq("id", authUser.id)
        }
      }
    } catch (error) {
      console.warn("Profile sync:", error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signInAndMigrateAnonymousData = async (email: string, password: string) => {
    const anonymousUserId = user?.is_anonymous ? user.id : null

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error

    const newUserId = data.user?.id

    if (anonymousUserId && newUserId && anonymousUserId !== newUserId) {
      await migrateAnonymousData(anonymousUserId, newUserId)
    }
  }

  const migrateAnonymousData = async (fromUserId: string, toUserId: string) => {
    try {
      const { error: ordersError } = await supabase
        .from("orders")
        .update({ user_id: toUserId, is_guest: false })
        .eq("user_id", fromUserId)

      if (ordersError) {
        console.warn("Error migrating orders:", ordersError.message)
      }

      const { data: existingAddress } = await supabase
        .from("user_addresses")
        .select("id")
        .eq("user_id", toUserId)
        .maybeSingle()

      if (!existingAddress) {
        const { error: addressError } = await supabase
          .from("user_addresses")
          .update({ user_id: toUserId })
          .eq("user_id", fromUserId)

        if (addressError) {
          console.warn("Error migrating address:", addressError.message)
        }
      } else {
        await supabase
          .from("user_addresses")
          .delete()
          .eq("user_id", fromUserId)
      }

      await supabase
        .from("profiles")
        .delete()
        .eq("id", fromUserId)
    } catch (error) {
      console.error("Error during data migration:", error)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName ?? email.split("@")[0],
        },
      },
    })

    if (error) throw error

    const needsEmailConfirmation = !!data.user && !data.session
    return { needsEmailConfirmation }
  }

  const signInAnonymously = async () => {
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) throw error

    if (data.user) {
      await ensureProfileExists(data.user)
    }
  }

  const linkEmailIdentity = async (email: string, password: string, fullName?: string): Promise<User | null> => {
    if (!user?.is_anonymous) {
      throw new Error("User is not anonymous")
    }

    const userId = user.id

    const { data, error } = await supabase.auth.updateUser({
      email,
      password,
      data: {
        full_name: fullName ?? email.split("@")[0],
      },
    })

    if (error) throw error

    void supabase
      .from("profiles")
      .update({
        is_guest: false,
        full_name: fullName ?? email.split("@")[0],
      })
      .eq("id", userId)

    return data.user
  }

  const deleteAccount = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    if (!currentSession?.access_token) {
      throw new Error("No active session")
    }

    const { data, error } = await supabase.functions.invoke("delete-account", {
      headers: {
        Authorization: `Bearer ${currentSession.access_token}`,
      },
    })

    if (error) {
      const message = typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : String(error)
      throw new Error(message || "Failed to delete account")
    }

    if (data?.error) {
      throw new Error(data.error)
    }

    await supabase.auth.signOut()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAnonymous,
        signIn,
        signInAndMigrateAnonymousData,
        signUp,
        signInAnonymously,
        linkEmailIdentity,
        signOut,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
