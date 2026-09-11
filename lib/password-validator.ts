/**
 * Maarif Akademi Güvenli Şifre Doğrulama Kuralları:
 * 1. En az 6 karakter
 * 2. En az 1 büyük harf (Türkçe karakterler dahil: A-Z, Ç, Ğ, İ, Ö, Ş, Ü)
 * 3. En az 1 küçük harf (Türkçe karakterler dahil: a-z, ç, ğ, ı, ö, ş, ü)
 * 4. En az 1 rakam (0-9)
 */

export interface PasswordValidationResult {
  isValid: boolean;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  errorMessage?: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  const p = password || '';
  const hasMinLength = p.length >= 6;
  const hasUpperCase = /[A-ZÇĞİÖŞÜ]/.test(p);
  const hasLowerCase = /[a-zçğıöşü]/.test(p);
  const hasNumber = /[0-9]/.test(p);

  const isValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;

  let errorMessage: string | undefined;
  if (!hasMinLength) {
    errorMessage = 'Şifreniz en az 6 karakter uzunluğunda olmalıdır.';
  } else if (!hasUpperCase) {
    errorMessage = 'Şifreniz en az 1 büyük harf içermelidir (Örn: A, B, Ç, D...).';
  } else if (!hasLowerCase) {
    errorMessage = 'Şifreniz en az 1 küçük harf içermelidir (Örn: a, b, c, d...).';
  } else if (!hasNumber) {
    errorMessage = 'Şifreniz en az 1 rakam içermelidir (Örn: 0-9).';
  }

  return {
    isValid,
    hasMinLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    errorMessage
  };
}
