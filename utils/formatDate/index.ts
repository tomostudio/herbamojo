/**
 * Matches the original Gatsby build's `date(formatString: "DD/MM/YY")`.
 */
export function formatDate(value: string): string {
  const date = new Date(value)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = String(date.getFullYear()).slice(-2)
  return `${day}/${month}/${year}`
}
