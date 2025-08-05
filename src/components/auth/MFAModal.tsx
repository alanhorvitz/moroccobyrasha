import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Mail, Key, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MFAService } from '@/lib/auth/mfa';

interface MFAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result: { mfaSessionId: string; verification: Record<string, unknown> }) => void;
  mfaSessionId: string;
  availableMethods: Array<'totp' | 'sms' | 'email'>;
  userEmail?: string;
  userPhone?: string;
}

const MFAModal: React.FC<MFAModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  mfaSessionId,
  availableMethods,
  userEmail,
  userPhone
}) => {
  const [activeMethod, setActiveMethod] = useState<'totp' | 'sms' | 'email'>(availableMethods[0]);
  const [code, setCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const sendSMSCode = async () => {
    if (!userPhone) return;
    
    setIsSendingCode(true);
    setError(null);
    
    try {
      const result = await MFAService.sendSMSCode(userPhone);
      if (result.success) {
        setCodeSent(true);
        setCountdown(60);
      } else {
        setError('Failed to send SMS code');
      }
    } catch (err) {
      setError('Failed to send SMS code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const sendEmailCode = async () => {
    if (!userEmail) return;
    
    setIsSendingCode(true);
    setError(null);
    
    try {
      const result = await MFAService.sendEmailCode(userEmail);
      if (result.success) {
        setCodeSent(true);
        setCountdown(60);
      } else {
        setError('Failed to send email code');
      }
    } catch (err) {
      setError('Failed to send email code');
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      let verification: Record<string, unknown>;

      if (useBackupCode) {
        verification = { backupCode };
      } else {
        switch (activeMethod) {
          case 'totp': {
            verification = { token: code };
            break;
          }
          case 'sms': {
            const smsValid = MFAService.verifySMSCode(userPhone!, code);
            if (!smsValid) {
              setError('Invalid SMS code');
              return;
            }
            verification = { token: code };
            break;
          }
          case 'email': {
            const emailValid = MFAService.verifyEmailCode(userEmail!, code);
            if (!emailValid) {
              setError('Invalid email code');
              return;
            }
            verification = { token: code };
            break;
          }
          default:
            verification = {};
        }
      }

      const isValid = await MFAService.verifyMFA(mfaSessionId, verification);
      
      if (isValid) {
        onSuccess({ mfaSessionId, verification });
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'totp': return <Shield className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <Key className="w-4 h-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'totp': return 'Authenticator';
      case 'sms': return 'SMS';
      case 'email': return 'Email';
      default: return method;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Multi-Factor Authentication
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!useBackupCode ? (
            <Tabs value={activeMethod} onValueChange={(value) => setActiveMethod(value as 'totp' | 'sms' | 'email')}>
              <TabsList className="grid w-full grid-cols-3">
                {availableMethods.map((method) => (
                  <TabsTrigger key={method} value={method} className="flex items-center gap-1">
                    {getMethodIcon(method)}
                    <span className="hidden sm:inline">{getMethodLabel(method)}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="totp" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Authenticator App
                    </CardTitle>
                    <CardDescription>
                      Enter the 6-digit code from your authenticator app
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="totp-code">Authentication Code</Label>
                      <Input
                        id="totp-code"
                        type="text"
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sms" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      SMS Verification
                    </CardTitle>
                    <CardDescription>
                      We'll send a verification code to {userPhone}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!codeSent ? (
                      <Button 
                        onClick={sendSMSCode} 
                        disabled={isSendingCode || countdown > 0}
                        className="w-full"
                      >
                        {isSendingCode ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-4 h-4 mr-2" />
                            Send SMS Code
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Code sent to {userPhone}
                        </Badge>
                        <div>
                          <Label htmlFor="sms-code">SMS Code</Label>
                          <Input
                            id="sms-code"
                            type="text"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            className="text-center text-lg tracking-widest"
                          />
                        </div>
                        {countdown === 0 && (
                          <Button 
                            variant="outline" 
                            onClick={sendSMSCode} 
                            disabled={isSendingCode}
                            className="w-full"
                          >
                            Resend Code
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Verification
                    </CardTitle>
                    <CardDescription>
                      We'll send a verification code to {userEmail}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!codeSent ? (
                      <Button 
                        onClick={sendEmailCode} 
                        disabled={isSendingCode || countdown > 0}
                        className="w-full"
                      >
                        {isSendingCode ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email Code
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Code sent to {userEmail}
                        </Badge>
                        <div>
                          <Label htmlFor="email-code">Email Code</Label>
                          <Input
                            id="email-code"
                            type="text"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            className="text-center text-lg tracking-widest"
                          />
                        </div>
                        {countdown === 0 && (
                          <Button 
                            variant="outline" 
                            onClick={sendEmailCode} 
                            disabled={isSendingCode}
                            className="w-full"
                          >
                            Resend Code
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Backup Code
                </CardTitle>
                <CardDescription>
                  Enter one of your backup recovery codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backup-code">Backup Code</Label>
                  <Input
                    id="backup-code"
                    type="text"
                    placeholder="Enter backup code"
                    value={backupCode}
                    onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col gap-3">
            <Button 
              onClick={verifyCode} 
              disabled={isVerifying || (!useBackupCode && !code) || (useBackupCode && !backupCode)}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => setUseBackupCode(!useBackupCode)}
              className="text-sm"
            >
              {useBackupCode ? 'Use Authentication Method' : 'Use Backup Code Instead'}
            </Button>

            <Button 
              variant="outline" 
              onClick={onClose}
              className="text-sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MFAModal;