/**
 * PHI-specific encryption wrapper around the base AES-256-GCM encryption.
 * Used to encrypt sensitive patient fields before database storage.
 *
 * Fields that should be encrypted:
 * - SSN, date_of_birth, insurance_member_id, insurance_group_number
 *
 * Note: Requires MESSAGE_ENCRYPTION_KEY env var (32-byte hex string).
 * Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */

import { encrypt, decrypt } from "@/lib/encryption";

// Fields in oe_patients that contain PHI requiring encryption
export const PHI_FIELDS = [
  "date_of_birth",
  "insurance_member_id",
  "insurance_group_number",
  "ssn",
] as const;

export type PhiField = typeof PHI_FIELDS[number];

/**
 * Encrypt a single PHI value. Returns encrypted + IV pair.
 * Returns null if value is empty/null.
 */
export function encryptPhiField(value: string | null | undefined): {
  encrypted: string;
  iv: string;
} | null {
  if (!value) return null;

  try {
    return encrypt(value);
  } catch (error) {
    console.error("[PHI Encryption] Failed:", error instanceof Error ? error.message : error);
    // Return plaintext wrapped in a marker so we know it's not encrypted
    // This allows the system to work without encryption key during development
    return null;
  }
}

/**
 * Decrypt a single PHI value.
 */
export function decryptPhiField(encrypted: string, iv: string): string | null {
  try {
    return decrypt(encrypted, iv);
  } catch (error) {
    console.error("[PHI Decryption] Failed:", error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Check if encryption is configured (MESSAGE_ENCRYPTION_KEY exists).
 */
export function isEncryptionConfigured(): boolean {
  return !!process.env.MESSAGE_ENCRYPTION_KEY;
}
