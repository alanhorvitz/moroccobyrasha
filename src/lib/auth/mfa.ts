export interface MFASession {
  valid: boolean;
  userId?: string;
  createdAt?: number;
}

export class MFAService {
  private static sessions = new Map<string, { userId: string; createdAt: number; completed: boolean }>();
  private static readonly SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  private static emailCodes = new Map<string, string>();
  private static smsCodes = new Map<string, string>();

  static async isMFAEnabled(userId: string): Promise<boolean> {
    // MFA is now disabled for all users
    return false;
  }

  static startMFASession(userId: string, requireMFA: boolean): string {
    const sessionId = this.generateSessionId();
    this.sessions.set(sessionId, {
      userId,
      createdAt: Date.now(),
      completed: false
    });
    return sessionId;
  }

  static validateMFASession(sessionId: string): MFASession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { valid: false };
    }

    // Check if session has expired
    if (Date.now() - session.createdAt > this.SESSION_TIMEOUT) {
      this.sessions.delete(sessionId);
      return { valid: false };
    }

    return {
      valid: true,
      userId: session.userId
    };
  }

  static async verifyMFA(userId: string, verification: Record<string, unknown>): Promise<boolean> {
    // In a real implementation, this would verify the MFA code
    // For demo purposes, we'll accept any 6-digit code
    if (verification.method === 'totp' && /^\d{6}$/.test(verification.code)) {
      return true;
    }
    if (verification.method === 'sms' && /^\d{6}$/.test(verification.code)) {
      return true;
    }
    if (verification.method === 'email' && /^\d{6}$/.test(verification.code)) {
      return true;
    }
    return false;
  }

  // This overloaded version is used by the MFA Modal
  static async verifyMFA(sessionId: string, verification: Record<string, unknown>): Promise<boolean> {
    const session = this.validateMFASession(sessionId);
    if (!session.valid) {
      return false;
    }
    
    // Demo implementation: accept any 6-digit code
    if (verification.token && /^\d{6}$/.test(verification.token)) {
      return true;
    }
    
    // Check backup code if provided
    if (verification.backupCode && verification.backupCode.length > 8) {
      // In a real implementation, we would validate the backup code against stored codes
      return true;
    }
    
    return false;
  }

  static completeMFASession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.completed = true;
      // Clean up completed session after a short delay
      setTimeout(() => {
        this.sessions.delete(sessionId);
      }, 1000);
    }
  }

  static getAvailableMFAMethods(user: Record<string, unknown>): Array<'totp' | 'sms' | 'email'> {
    // MFA methods are now disabled - return empty array
    return [];
  }

  private static generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  static async sendMFACode(userId: string, method: 'sms' | 'email'): Promise<boolean> {
    // In a real implementation, this would send the actual MFA code
    console.log(`Sending MFA code via ${method} to user ${userId}`);
    return true;
  }

  // Generate a random 6-digit code
  private static generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Method to send SMS verification code
  static async sendSMSCode(phone: string): Promise<{success: boolean}> {
    // Generate a code and store it
    const code = this.generateVerificationCode();
    this.smsCodes.set(phone, code);
    
    console.log(`[DEMO] SMS Code for ${phone}: ${code}`);
    
    // In a real implementation, we would send an SMS
    return { success: true };
  }

  // Method to verify SMS code
  static verifySMSCode(phone: string, code: string): boolean {
    const storedCode = this.smsCodes.get(phone);
    
    if (!storedCode) {
      return false;
    }
    
    // For demo purposes, also accept any 6-digit code
    if (/^\d{6}$/.test(code)) {
      return true;
    }
    
    return storedCode === code;
  }

  // Method to send Email verification code
  static async sendEmailCode(email: string): Promise<{success: boolean}> {
    // Generate a code and store it
    const code = this.generateVerificationCode();
    this.emailCodes.set(email, code);
    
    console.log(`[DEMO] Email Code for ${email}: ${code}`);
    
    // In a real implementation, we would send an email
    return { success: true };
  }

  // Method to verify email code
  static verifyEmailCode(email: string, code: string): boolean {
    const storedCode = this.emailCodes.get(email);
    
    if (!storedCode) {
      return false;
    }
    
    // For demo purposes, also accept any 6-digit code
    if (/^\d{6}$/.test(code)) {
      return true;
    }
    
    return storedCode === code;
  }

  static generateTOTPSecret(): string {
    // Generate a base32 secret for TOTP
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }
}