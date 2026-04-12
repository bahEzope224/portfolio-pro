import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a "YYYY-MM" date string to a readable month/year */
export function formatMonthYear(dateStr: string, lang = 'fr'): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  const locale = lang.startsWith('fr') ? 'fr-FR' : 'en-GB'
  return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
}

/** Build full URL for an uploaded file */
export function assetUrl(path?: string | null): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') ?? ''
  return `${base}/${path}`
}

/** Truncate text to `n` characters */
export function truncate(text: string, n = 120): string {
  return text.length > n ? text.slice(0, n) + '…' : text
}
