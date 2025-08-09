import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Mail, Lock, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { ValidationService } from '@/lib/auth/validation';
import { SecurityService } from '@/lib/auth/security';
import { EnhancedAuthAPI } from '@/lib/auth/enhanced-api';
import MFAModal from '@/components/auth/MFAModal';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remaining: number;
    resetTime?: number;
  } | null>(null);
  const [mfaData, setMfaData] = useState<{
    isOpen: boolean;
    sessionId: string;
    availableMethods: Array<'totp' | 'sms' | 'email'>;
    userEmail?: string;
    userPhone?: string;
  } | null>(null);

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || '/';

  // Function to get role-specific dashboard path
  const getRoleDashboardPath = (role: string): string => {
    switch (role) {
      case 'ADMIN':
      case 'SUPER_ADMIN':
        return '/dashboard/admin';
      case 'GUIDE':
        return '/dashboard/guide';
      case 'TOURIST':
        return '/dashboard/tourist';
      default:
        return '/dashboard';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const validationErrors: string[] = [];
    
    // Email validation
    const emailValidation = ValidationService.validateEmail(formData.email);
    if (!emailValidation.isValid) {
      validationErrors.push(...emailValidation.errors);
    }
    
    // Password validation
    if (!formData.password) {
      validationErrors.push('Password is required');
    }
    
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Check rate limiting before attempting login
    const rateLimitCheck = SecurityService.checkRateLimit(formData.email);
    setRateLimitInfo(rateLimitCheck);
    
    if (!rateLimitCheck.allowed) {
      const resetTime = rateLimitCheck.resetTime 
        ? new Date(rateLimitCheck.resetTime).toLocaleTimeString()
        : 'unknown';
      setErrors([`Too many login attempts. Please try again after ${resetTime}`]);
      return;
    }

    try {
      // Use the AuthContext login function which properly sets the user state
      const response = await login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      if (response.success) {
        // Get user data from the response to determine role
        const userData = response.data?.user;
        
        if (userData) {
          // Redirect to role-specific dashboard
          const dashboardPath = getRoleDashboardPath(userData.role);
          navigate(dashboardPath, { replace: true });
        } else {
          // Fallback to intended destination or dashboard
          navigate(from === '/' ? '/dashboard' : from, { replace: true });
        }
      } else if (response.data?.requiresMFA) {
        // MFA required (though it's disabled now, keeping for compatibility)
        setMfaData({
          isOpen: true,
          sessionId: response.data.mfaSessionId,
          availableMethods: response.data.availableMethods,
          userEmail: formData.email,
          userPhone: response.data.userPhone
        });
        setErrors([]);
      } else {
        setErrors([response.message || 'Login failed']);
      }
    } catch (error) {
      setErrors(['An unexpected error occurred. Please try again.']);
    }
  };

  const handleMFASuccess = async (mfaResult: { mfaSessionId: string; verification: Record<string, unknown> }) => {
    try {
      const response = await EnhancedAuthAPI.completeMFALogin(
        mfaResult.mfaSessionId, 
        mfaResult.verification
      );

      if (response.success) {
        setMfaData(null);
        // Redirect to role-specific dashboard after MFA
        const userData = response.data?.user;
        if (userData) {
          const dashboardPath = getRoleDashboardPath(userData.role);
          navigate(dashboardPath, { replace: true });
        } else {
          navigate(from === '/' ? '/dashboard' : from, { replace: true });
        }
      } else {
        setMfaData(null);
        setErrors([response.message || 'MFA verification failed']);
      }
    } catch (error) {
      setMfaData(null);
      setErrors(['MFA verification failed. Please try again.']);
    }
  };

  const handleMFAClose = () => {
    setMfaData(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your Morocco Platform account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Display */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Rate Limit Warning */}
            {rateLimitInfo && !rateLimitInfo.remaining && rateLimitInfo.resetTime && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  For security, login attempts are limited. You have {rateLimitInfo.remaining} attempts remaining.
                </AlertDescription>
              </Alert>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </div>
              )}
            </Button>

            {/* Sign Up Link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link
                to="/register"
                className="text-emerald-600 hover:text-emerald-700 hover:underline font-medium"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* MFA Modal */}
      {mfaData && (
        <MFAModal
          isOpen={mfaData.isOpen}
          onClose={handleMFAClose}
          onSuccess={handleMFASuccess}
          sessionId={mfaData.sessionId}
          availableMethods={mfaData.availableMethods}
          userEmail={mfaData.userEmail}
          userPhone={mfaData.userPhone}
        />
      )}
    </div>
  );
};

export default Login;