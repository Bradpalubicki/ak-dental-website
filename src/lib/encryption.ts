import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const key = process.env.MESSAGE_ENCRYPTION_KEY;
  if (!key) throw new Error("MESSAGE_ENCRYPTION_KEY not set");
  return Buffer.from(key, "hex");
}

export function encrypt(plaintext: string): { encrypted: string; iv: string } {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();

  // Append auth tag to ciphertext
  const combined = Buffer.concat([
    Buffer.from(encrypted, "base64"),
    authTag,
  ]);

  return {
    encrypted: combined.toString("base64"),
    iv: iv.toString("base64"),
  };
}

export function decrypt(encryptedData: string, ivBase64: string): string {
  const iv = Buffer.from(ivBase64, "base64");
  const combined = Buffer.from(encryptedData, "base64");

  // Split ciphertext and auth tag
  const ciphertext = combined.subarray(0, combined.length - AUTH_TAG_LENGTH);
  const authTag = combined.subarray(combined.length - AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, getKey(), iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertext, undefined, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
