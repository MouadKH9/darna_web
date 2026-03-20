export function Footer() {
  return (
    <footer className="hidden border-t border-border/40 bg-warm/30 dark:bg-warm/20 md:block">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-display text-xl font-bold italic text-primary">
              Darna
            </span>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Saveurs marocaines authentiques, préparées avec passion et livrées chez vous.
            </p>
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
    </footer>
  )
}
