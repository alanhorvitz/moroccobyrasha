import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface VerifyEmailProps {
  email: string
}

export function VerifyEmail({ email }: VerifyEmailProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const handleResendVerification = async () => {
    setIsResending(true)
    setError('')
    setResendSuccess(false)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error('Failed to resend verification email')
      }

      setResendSuccess(true)
    } catch (error) {
      console.error('Resend verification error:', error)
      setError('Failed to resend verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('auth.verifyEmail.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.verifyEmail.description', { email })}
        </p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="text-sm font-medium text-destructive text-center">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="text-sm font-medium text-green-600 text-center">
            {t('auth.verifyEmail.resendSuccess')}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleResendVerification}
          disabled={isResending}
        >
          {isResending
            ? t('common.sending')
            : t('auth.verifyEmail.resendButton')}
        </Button>

        <div className="text-center text-sm">
          <a
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t('auth.verifyEmail.backToLogin')}
          </a>
        </div>
      </div>
    </div>
  )
} 