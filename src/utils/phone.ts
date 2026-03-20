/**
 * Validate Moroccan phone number format.
 * Accepts: 0612345678, +212612345678, 212612345678
 */
export function isValidMoroccanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().]/g, "")
  return /^(?:\+?212|0)[5-7]\d{8}$/.test(cleaned)
}

/**
 * Format phone number for display.
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, "")
  if (cleaned.startsWith("+212")) {
    const local = cleaned.slice(4)
    return `+212 ${local.slice(0, 1)} ${local.slice(1, 3)} ${local.slice(3, 5)} ${local.slice(5, 7)} ${local.slice(7)}`
  }
  if (cleaned.startsWith("0")) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`
  }
  return phone
}
