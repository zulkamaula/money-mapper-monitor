/**
 * Format percentage value, removing unnecessary decimal places
 * Examples:
 * - 10 → "10%"
 * - 10.5 → "10.5%"
 * - 10.25 → "10.25%"
 * - 10.00 → "10%"
 */
export function formatPercentage(value: number): string {
  // Remove trailing zeros by converting to number
  const formatted = parseFloat(value.toFixed(2))
  return `${formatted}%`
}

/**
 * Format currency with Indonesian Rupiah format
 * Examples:
 * - 1000 → "Rp 1.000"
 * - 1000000 → "Rp 1.000.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format number input with thousand separators (for display in input fields)
 * Examples:
 * - 1000 → "1.000"
 * - 1000000 → "1.000.000"
 */
export function formatNumberInput(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/\./g, '')) : value
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Parse formatted number input back to number
 * Removes thousand separators and converts to number
 * Handles Indonesian format: dots for thousands, comma for decimals
 * Examples:
 * - "1.000" → 1000
 * - "1.000.000" → 1000000
 * - "Rp 3.000.200,00" → 3000200
 */
export function parseNumberInput(value: string): number {
  // Remove currency symbols and whitespace
  let cleaned = value.replace(/Rp/gi, '').trim()

  // Remove decimal part (anything after comma)
  const parts = cleaned.split(',')
  cleaned = parts[0] || ''

  // Remove thousand separators (dots)
  cleaned = cleaned.replace(/\./g, '')

  // Extract only digits
  cleaned = cleaned.replace(/[^\d]/g, '')

  return parseInt(cleaned) || 0
}
