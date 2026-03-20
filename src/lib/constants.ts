export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  preparing: "En préparation",
  ready: "Prête",
  delivering: "En livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-warning/20 text-warning",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  preparing: "bg-primary/10 text-primary",
  ready: "bg-success/20 text-success",
  delivering: "bg-secondary/20 text-secondary",
  delivered: "bg-success/20 text-success",
  cancelled: "bg-destructive/10 text-destructive",
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Espèces",
  card: "Carte bancaire",
}

export const BRAND = {
  name: "Darna",
  tagline: "Saveurs marocaines, livrées chez vous",
  currency: "MAD",
  phone: "+212",
} as const
