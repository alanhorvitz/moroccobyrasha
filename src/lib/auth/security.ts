interface RateLimitInfo {
  allowed: boolean;
  remaining: number;
  resetTime?: number;
}

interface PasswordStrengthResult {
  score: number;
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  errors: string[];
  suggestions: string[];
}

export class SecurityService {
  private static readonly RATE_LIMIT_MAX_ATTEMPTS = 5;
  private static readonly RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  private static rateLimitStore = new Map<string, { attempts: number; firstAttempt: number }>();

  static checkRateLimit(identifier: string): RateLimitInfo {
    const now = Date.now();
    const record = this.rateLimitStore.get(identifier);

    if (!record) {
      // First attempt
      this.rateLimitStore.set(identifier, { attempts: 1, firstAttempt: now });
      return {
        allowed: true,
        remaining: this.RATE_LIMIT_MAX_ATTEMPTS - 1
      };
    }

    // Check if window has expired
    if (now - record.firstAttempt > this.RATE_LIMIT_WINDOW) {
      // Reset the window
      this.rateLimitStore.set(identifier, { attempts: 1, firstAttempt: now });
      return {
        allowed: true,
        remaining: this.RATE_LIMIT_MAX_ATTEMPTS - 1
      };
    }

    // Check if limit exceeded
    if (record.attempts >= this.RATE_LIMIT_MAX_ATTEMPTS) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.firstAttempt + this.RATE_LIMIT_WINDOW
      };
    }

    // Increment attempts
    record.attempts++;
    return {
      allowed: true,
      remaining: this.RATE_LIMIT_MAX_ATTEMPTS - record.attempts
    };
  }

  static resetRateLimit(identifier: string): void {
    this.rateLimitStore.delete(identifier);
  }

  static isValidJWTStructure(token: string): boolean {
    if (!token) return false;
    const parts = token.split('.');
    return parts.length === 3;
  }

  static generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');

    return btoa(fingerprint).replace(/[+/=]/g, '').substring(0, 32);
  }

  static generateSecureRandom(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static generateCSRFToken(): string {
    const token = this.generateSecureRandom();
    sessionStorage.setItem('csrf-token', token);
    return token;
  }

  static getCSRFToken(): string | null {
    return sessionStorage.getItem('csrf-token');
  }

  static validateCSRFToken(token: string): boolean {
    const storedToken = this.getCSRFToken();
    return storedToken === token;
  }

  static sanitizeInput(input: string): string {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
  }

  static hashPassword(password: string): string {
    // In a real implementation, you would use a proper hashing library like bcrypt
    // This is a simplified version for demo purposes
    return btoa(password + 'salt').replace(/[+/=]/g, '');
  }

  static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }
}

export class AdvancedPasswordValidator {
  static validateAdvanced(password: string): PasswordStrengthResult {
    let score = 0;
    const errors: string[] = [];
    const suggestions: string[] = [];

    // Length scoring
    if (password.length >= 8) score += 1;
    else errors.push('Use at least 8 characters');

    if (password.length >= 12) score += 1;
    else suggestions.push('Use 12+ characters for better security');

    if (password.length >= 16) score += 1;

    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    else errors.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 1;
    else errors.push('Add uppercase letters');

    if (/\d/.test(password)) score += 1;
    else errors.push('Add numbers');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else errors.push('Add special characters');

    // Advanced checks
    if (!/(.)\1{2,}/.test(password)) score += 1;
    else suggestions.push('Avoid repeating characters');

    if (!/123|abc|qwe|password|admin/i.test(password)) score += 1;
    else suggestions.push('Avoid common words and sequences');

    // Entropy check
    const uniqueChars = new Set(password).size;
    if (uniqueChars / password.length > 0.6) score += 1;
    else suggestions.push('Use more varied characters');

    let strength: PasswordStrengthResult['strength'];
    if (score <= 2) strength = 'very-weak';
    else if (score <= 3) strength = 'weak';
    else if (score <= 5) strength = 'fair';
    else if (score <= 7) strength = 'good';
    else if (score <= 8) strength = 'strong';
    else strength = 'very-strong';

    return {
      score,
      strength,
      errors,
      suggestions
    };
  }
}