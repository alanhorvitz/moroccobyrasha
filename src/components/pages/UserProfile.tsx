"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Mail, Phone, Globe, Bell, Lock, Eye, EyeOff, Save, ArrowLeft 
} from 'lucide-react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ValidationService } from '@/lib/auth/validation';

const UserProfile: React.FC = () => {
  const navigate = useRouter();
  const { user, updateProfile, changePassword, isLoading } = useAuth();
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    language: user?.preferences?.language || 'en',
    emailNotifications: user?.preferences?.notifications?.email || false,
    smsNotifications: user?.preferences?.notifications?.sms || false,
    pushNotifications: user?.preferences?.notifications?.push || false,
    profileVisible: user?.preferences?.privacy?.profileVisible || false,
    showPhone: user?.preferences?.privacy?.showPhone || false,
    showEmail: user?.preferences?.privacy?.showEmail || false,
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [profileErrors, setProfileErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  if (!user) {
    return <div>Loading user data...</div>;
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors and success messages when user makes changes
    setProfileErrors([]);
    setSuccessMessage(null);
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setProfileData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors and success messages when user makes changes
    setPasswordErrors([]);
    setSuccessMessage(null);
  };
  
  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  const validateProfileForm = (): boolean => {
    const validationErrors: string[] = [];
    
    // Name validation
    if (!profileData.firstName.trim()) {
      validationErrors.push('First name is required');
    }
    
    if (!profileData.lastName.trim()) {
      validationErrors.push('Last name is required');
    }
    
    // Email validation
    const emailValidation = ValidationService.validateEmail(profileData.email);
    if (!emailValidation.isValid) {
      validationErrors.push(...emailValidation.errors);
    }
    
    // Phone validation (optional)
    if (profileData.phone) {
      const phonePattern = /^\+?[\d\s()-]{8,20}$/;
      if (!phonePattern.test(profileData.phone)) {
        validationErrors.push('Please enter a valid phone number');
      }
    }
    
    setProfileErrors(validationErrors);
    return validationErrors.length === 0;
  };
  
  const validatePasswordForm = (): boolean => {
    const validationErrors: string[] = [];
    
    // Current password validation
    if (!passwordData.currentPassword) {
      validationErrors.push('Current password is required');
    }
    
    // New password validation
    const passwordValidation = ValidationService.validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      validationErrors.push(...passwordValidation.errors);
    }
    
    // Confirm password validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      validationErrors.push('New password and confirmation do not match');
    }
    
    setPasswordErrors(validationErrors);
    return validationErrors.length === 0;
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    try {
      await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        bio: profileData.bio,
        preferences: {
          language: profileData.language,
          notifications: {
            email: profileData.emailNotifications,
            sms: profileData.smsNotifications,
            push: profileData.pushNotifications
          },
          privacy: {
            profileVisible: profileData.profileVisible,
            showPhone: profileData.showPhone,
            showEmail: profileData.showEmail
          }
        }
      });
      
      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      setProfileErrors(['Failed to update profile. Please try again.']);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      if (response.success) {
        setSuccessMessage('Password changed successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordErrors([response.message || 'Failed to change password']);
      }
    } catch (error) {
      setPasswordErrors(['An unexpected error occurred. Please try again.']);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-8 space-x-4">
        <Button variant="outline" size="icon" onClick={() => navigate.push('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>
      
      {successMessage && (
        <Alert className="mb-6 bg-emerald-50 border-emerald-200">
          <AlertDescription className="text-emerald-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>
        
        {/* Profile Information Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-emerald-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleProfileSubmit}>
                <CardContent className="space-y-4">
                  {profileErrors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {profileErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="pl-10"
                        disabled
                      />
                    </div>
                    <p className="text-sm text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="pl-10"
                        placeholder="+1234567890"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio / About Me</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      placeholder="Tell us a little about yourself..."
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-700 ml-auto"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {/* Preferences */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-emerald-600" />
                    Preferences
                  </CardTitle>
                  <CardDescription>
                    Set your language and notification preferences
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      name="language"
                      value={profileData.language}
                      onChange={(e) => handleProfileChange(e as React.ChangeEvent<HTMLSelectElement>)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                      <option value="ar">العربية</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-base">Notification Settings</Label>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive updates via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={profileData.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive updates via text message</p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={profileData.smsNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('smsNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={profileData.pushNotifications}
                        onCheckedChange={(checked) => handleSwitchChange('pushNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-emerald-600" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control who can see your information
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="profileVisible">Public Profile</Label>
                        <p className="text-sm text-gray-500">Make your profile visible to others</p>
                      </div>
                      <Switch
                        id="profileVisible"
                        checked={profileData.profileVisible}
                        onCheckedChange={(checked) => handleSwitchChange('profileVisible', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showPhone">Show Phone Number</Label>
                        <p className="text-sm text-gray-500">Display your phone number on your profile</p>
                      </div>
                      <Switch
                        id="showPhone"
                        checked={profileData.showPhone}
                        onCheckedChange={(checked) => handleSwitchChange('showPhone', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="showEmail">Show Email Address</Label>
                        <p className="text-sm text-gray-500">Display your email on your profile</p>
                      </div>
                      <Switch
                        id="showEmail"
                        checked={profileData.showEmail}
                        onCheckedChange={(checked) => handleSwitchChange('showEmail', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-700 ml-auto"
                    onClick={handleProfileSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5 text-emerald-600" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                {passwordErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1">
                        {passwordErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showPassword.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10"
                      placeholder="Enter your current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Password must be at least 8 characters with a mix of letters, numbers & symbols
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="pl-10 pr-10"
                      placeholder="Confirm your new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 ml-auto"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Update Password
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;