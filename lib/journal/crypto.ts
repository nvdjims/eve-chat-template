import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from "node:crypto";

// Journal entries are encrypted with AES-256-GCM before they reach the
// database. The key comes from JOURNAL_ENCRYPTION_KEY, or is derived from
// BETTER_AUTH_SECRET when that variable is not set. Anyone reading the raw
// database sees only ciphertext.

const VERSION = "v1";

function getKey() {
  const secret =
    process.env.JOURNAL_ENCRYPTION_KEY?.trim() || process.env.BETTER_AUTH_SECRET?.trim();

  if (!secret) {
    throw new Error("JOURNAL_ENCRYPTION_KEY or BETTER_AUTH_SECRET is required.");
  }

  return Buffer.from(hkdfSync("sha256", secret, "carnet-journal", "journal-entry", 32));
}

export function encryptText(plaintext: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const data = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [VERSION, iv.toString("base64"), tag.toString("base64"), data.toString("base64")].join(".");
}

export function decryptText(payload: string) {
  const [version, iv, tag, data] = payload.split(".");

  if (version !== VERSION || !iv || !tag || !data) {
    throw new Error("Unsupported journal payload.");
  }

  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));

  return Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString(
    "utf8",
  );
}
