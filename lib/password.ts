import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 10;
const ENCRYPTION_SECRET = process.env.NEXTAUTH_SECRET || process.env.ENCRYPTION_KEY || 'maarif-academic-platform-secure-key-2024';
const ENC_PREFIX = 'enc:';
const IV_LENGTH = 16;
// Derive deterministic 32-byte key for AES-256
const AES_KEY = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();

/**
 * Hashes a plain password using bcryptjs with 10 salt rounds (for teachers and admins).
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Checks if a stored password string is already a bcrypt hash.
 */
export function isPasswordHashed(password?: string | null): boolean {
  if (!password) return false;
  return password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$');
}

/**
 * Checks if a stored password is encrypted with two-way AES encryption.
 */
export function isEncryptedStudentPassword(password?: string | null): boolean {
  if (!password) return false;
  return password.startsWith(ENC_PREFIX);
}

/**
 * Encrypts a student password reversibly using AES-256-CBC.
 * This allows teachers to view, print cards, and distribute passwords to students.
 */
export function encryptStudentPassword(plainText: string): string {
  if (!plainText) return '';
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', AES_KEY, iv);
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${ENC_PREFIX}${iv.toString('hex')}:${encrypted}`;
}

function getCandidateKeys(): Buffer[] {
  const secrets = [
    process.env.NEXTAUTH_SECRET,
    process.env.ENCRYPTION_KEY,
    'maarif_prod_jwt_super_secure_auth_key_2026_x87b1c9',
    'maarif-academic-platform-secure-key-2024'
  ].filter(Boolean) as string[];
  return Array.from(new Set(secrets)).map((s) => crypto.createHash('sha256').update(s).digest());
}

/**
 * Decrypts a student password that was encrypted with encryptStudentPassword.
 * If the input is not encrypted, returns the plain string as-is.
 */
export function decryptStudentPassword(cipherText?: string | null): string {
  if (!cipherText) return '';
  if (!cipherText.startsWith(ENC_PREFIX)) {
    // If it's a bcrypt hash, it cannot be mathematically decrypted
    if (isPasswordHashed(cipherText)) {
      return '';
    }
    return cipherText;
  }

  const raw = cipherText.slice(ENC_PREFIX.length);
  const parts = raw.split(':');
  if (parts.length !== 2) return '';

  for (const key of getCandidateKeys()) {
    try {
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedData = parts[1];
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      if (decrypted && decrypted.trim().length > 0) {
        return decrypted.trim();
      }
    } catch {
      // try next key
    }
  }

  return '';
}

/**
 * Verifies a plain password against a stored hash, encrypted string, or plain string.
 */
export async function verifyPassword(
  plainPassword: string,
  storedHashOrPlain?: string | null
): Promise<boolean> {
  if (!plainPassword || !storedHashOrPlain) return false;

  // 1. Two-way AES encrypted student password
  if (isEncryptedStudentPassword(storedHashOrPlain)) {
    const decrypted = decryptStudentPassword(storedHashOrPlain);
    return plainPassword === decrypted;
  }

  // 2. One-way bcrypt hash (teachers, admins, legacy students)
  if (isPasswordHashed(storedHashOrPlain)) {
    try {
      return await bcrypt.compare(plainPassword, storedHashOrPlain);
    } catch (err) {
      console.error('[Password Verification] Bcrypt compare error:', err);
      return false;
    }
  }

  // 3. Plaintext fallback
  return plainPassword === storedHashOrPlain;
}

