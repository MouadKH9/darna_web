import Image from "next/image"

export function Footer() {
  return (
    <footer className="hidden border-t moroccan-border bg-warm/20 dark:bg-warm/10 md:block">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-zellige opacity-30" />
        <div className="relative mx-auto max-w-5xl px-4 py-10">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Darna" width={48} height={48} className="h-12 w-12 object-contain" />
              <div>
                <span className="font-display text-2xl font-bold italic text-gradient-warm">
                  Darna
                </span>
                <p className="mt-0.5 font-display text-sm italic text-muted-foreground/70">
                  دارنا — بيتكم الثاني
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground/60">
                &copy; {new Date().getFullYear()} Darna
              </p>
              <p className="mt-1 text-xs text-muted-foreground/60">
                Tous droits réservés
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
