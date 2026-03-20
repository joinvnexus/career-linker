import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value)
  return new Intl.DateTimeFormat("bn-BD", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function formatSalary(min: number | null, max: number | null) {
  if (min === null && max === null) return "Negotiable"
  if (min !== null && max !== null) return `${formatCurrency(min)} - ${formatCurrency(max)}`
  if (min !== null) return `${formatCurrency(min)}+`
  return formatCurrency(max!)
}

