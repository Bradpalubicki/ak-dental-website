/**
 * Normalize a phone number to E.164 format (+1XXXXXXXXXX for US numbers).
 * Handles common formats: (555) 123-4567, 555-123-4567, 5551234567, +15551234567
 */
export function normalizePhone(phone: string): string | null {
  if (!phone) return null;

  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // US number with country code
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  // US number without country code
  if (digits.length === 10) {
    return `+1${digits}`;
  }

  // Already has + prefix with valid length
  if (phone.startsWith("+") && digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }

  return null;
}

/**
 * Format a phone number for display: +15551234567 -> (555) 123-4567
 */
export function formatPhone(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("1")) {
    const area = digits.slice(1, 4);
    const prefix = digits.slice(4, 7);
    const line = digits.slice(7);
    return `(${area}) ${prefix}-${line}`;
  }

  if (digits.length === 10) {
    const area = digits.slice(0, 3);
    const prefix = digits.slice(3, 6);
    const line = digits.slice(6);
    return `(${area}) ${prefix}-${line}`;
  }

  return phone;
}
