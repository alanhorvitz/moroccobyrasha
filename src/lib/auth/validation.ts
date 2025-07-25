export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordStrengthResult {
  score: number;
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  errors: string[];
  suggestions: string[];
}

export class ValidationService {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateRegistration(data: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
    agreeToTerms: boolean;
  }): ValidationResult {
    const errors: string[] = [];
    
    // Email validation
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push(...emailValidation.errors);
    }
    
    // Password validation
    const passwordValidation = this.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
    
    // Confirm password
    if (data.password !== data.confirmPassword) {
      errors.push('Passwords do not match');
    }
    
    // Name validation
    if (!data.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!data.lastName?.trim()) {
      errors.push('Last name is required');
    }
    
    // Phone validation (if provided)
    if (data.phone && data.phone.trim()) {
      const phoneRegex = /^\+?[\d\s\-()]{10,}$/;
      if (!phoneRegex.test(data.phone)) {
        errors.push('Please enter a valid phone number');
      }
    }
    
    // Terms agreement
    if (!data.agreeToTerms) {
      errors.push('You must agree to the terms and conditions');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getPasswordStrength(password: string): PasswordStrengthResult {
    let score = 0;
    const errors: string[] = [];
    const suggestions: string[] = [];
    
    // Length check
    if (password.length >= 8) score += 1;
    else errors.push('Use at least 8 characters');
    
    if (password.length >= 12) score += 1;
    else suggestions.push('Use 12 or more characters for better security');
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    else errors.push('Add lowercase letters');
    
    if (/[A-Z]/.test(password)) score += 1;
    else errors.push('Add uppercase letters');
    
    if (/\d/.test(password)) score += 1;
    else errors.push('Add numbers');
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else errors.push('Add special characters');
    
    // Avoid common patterns
    if (!/(.)\1{2,}/.test(password)) score += 1;
    else suggestions.push('Avoid repeating characters');
    
    if (!/123|abc|qwe/i.test(password)) score += 1;
    else suggestions.push('Avoid common sequences');
    
    let strength: PasswordStrengthResult['strength'];
    if (score <= 2) strength = 'very-weak';
    else if (score <= 3) strength = 'weak';
    else if (score <= 4) strength = 'fair';
    else if (score <= 6) strength = 'good';
    else if (score <= 7) strength = 'strong';
    else strength = 'very-strong';
    
    return {
      score,
      strength,
      errors,
      suggestions
    };
  }
}

export const getPasswordStrengthColor = (strength: PasswordStrengthResult['strength']): string => {
  switch (strength) {
    case 'very-weak': return 'text-red-600';
    case 'weak': return 'text-red-500';
    case 'fair': return 'text-yellow-500';
    case 'good': return 'text-blue-500';
    case 'strong': return 'text-green-500';
    case 'very-strong': return 'text-green-600';
    default: return 'text-gray-500';
  }
};

export const getPasswordStrengthText = (strength: PasswordStrengthResult['strength']): string => {
  switch (strength) {
    case 'very-weak': return 'Very Weak';
    case 'weak': return 'Weak';
    case 'fair': return 'Fair';
    case 'good': return 'Good';
    case 'strong': return 'Strong';
    case 'very-strong': return 'Very Strong';
    default: return 'Unknown';
  }
};