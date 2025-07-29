'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSuccess(true)
    } catch (error) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">{t('auth.forgotPassword.success.title', 'Check Your Email')}</CardTitle>
            <CardDescription>
              {t('auth.forgotPassword.success.description', 'We\'ve sent password reset instructions to your email')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              {t('auth.forgotPassword.success.instructions', 
                'Please check your email and follow the instructions to reset your password. The link will expire in 24 hours.'
              )}
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('auth.backToLogin', 'Back to Login')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{t('auth.forgotPassword.title', 'Reset Password')}</CardTitle>
          <CardDescription>
            {t('auth.forgotPassword.description', 'Enter your email address and we\'ll send you a link to reset your password')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email', 'Email')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('auth.email.placeholder', 'Enter your email')}
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('auth.forgotPassword.sending', 'Sending...')}
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  {t('auth.forgotPassword.submit', 'Send Reset Link')}
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('auth.backToLogin', 'Back to Login')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}