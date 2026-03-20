import type { Metadata } from "next"
import { Playfair_Display, Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { CartProvider } from "@/providers/cart-provider"
import { ToastProvider } from "@/providers/toast-provider"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Darna — Saveurs marocaines, livrées chez vous",
  description:
    "Commandez vos plats marocains préférés en ligne. Livraison rapide dans votre zone.",
  openGraph: {
    title: "Darna — Saveurs marocaines",
    description: "Commandez vos plats marocains préférés en ligne.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} antialiased bg-texture`}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <CartProvider>
                {children}
                <ToastProvider />
              </CartProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
