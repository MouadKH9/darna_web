"use client"

import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { AuthForm } from "@/components/auth/auth-form"
import { PageTransition } from "@/components/layout/page-transition"

export default function LoginPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <PageTransition>
        <main className="mx-auto max-w-lg px-4 py-12">
          <Suspense>
            <AuthForm />
          </Suspense>
        </main>
      </PageTransition>

      <MobileNav />
    </div>
  )
}
