import crypto from "crypto";

const algorithm = "aes-256-gcm";
const secret = crypto
  .createHash("sha256")
  .update(process.env.JWT_SECRET)
  .digest();

export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secret, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64");
}

export function decrypt(encryptedText) {
  const data = Buffer.from(encryptedText, "base64");

  const iv = data.subarray(0, 16);
  const tag = data.subarray(16, 32);
  const text = data.subarray(32);

  const decipher = crypto.createDecipheriv(algorithm, secret, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(text), decipher.final()]);

  return decrypted.toString("utf8");
}
