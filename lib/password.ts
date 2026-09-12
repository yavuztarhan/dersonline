import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plain password using bcryptjs with 10 salt rounds.
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
 * Verifies a plain password against a stored hash or plain string.
 * Supports transparent backward-compatibility with existing seed/demo plaintext passwords.
 */
export async function verifyPassword(
  plainPassword: string,
  storedHashOrPlain?: string | null
): Promise<boolean> {
  if (!plainPassword || !storedHashOrPlain) return false;

  if (isPasswordHashed(storedHashOrPlain)) {
    try {
      return await bcrypt.compare(plainPassword, storedHashOrPlain);
    } catch (err) {
      console.error('[Password Verification] Bcrypt compare error:', err);
      return false;
    }
  }

  // Fallback for existing unhashed plaintext passwords in database/store
  return plainPassword === storedHashOrPlain;
}
