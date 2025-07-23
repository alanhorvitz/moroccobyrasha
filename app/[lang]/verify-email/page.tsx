'use client'

import { VerifyEmail } from '@/components/auth/verify-email'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { user } = useAuth()
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending')

  useEffect(() => {
    if (token) {
      verifyEmail()
    }
  }, [token])

  async function verifyEmail() {
    setIsVerifying(true)
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error('Verification failed')
      }

      setVerificationStatus('success')
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationStatus('error')
    } finally {
      setIsVerifying(false)
    }
  }

  if (token) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">
          {isVerifying ? (
            <h1 className="text-2xl font-semibold mb-2">Verifying your email...</h1>
          ) : verificationStatus === 'success' ? (
            <>
              <h1 className="text-2xl font-semibold mb-2">Email Verified!</h1>
              <p className="text-muted-foreground">
                Your email has been verified. You can now access all features.
              </p>
              <a
                href="/login"
                className="mt-4 inline-block underline underline-offset-4 hover:text-primary"
              >
                Continue to login
              </a>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-2">Verification Failed</h1>
              <p className="text-muted-foreground">
                The verification link is invalid or has expired.
              </p>
              <button
                onClick={verifyEmail}
                className="mt-4 underline underline-offset-4 hover:text-primary"
              >
                Try again
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  if (!user?.email) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            Please log in to verify your email address.
          </p>
          <a
            href="/login"
            className="mt-4 inline-block underline underline-offset-4 hover:text-primary"
          >
            Go to login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <VerifyEmail email={user.email} />
        </div>
      </div>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <img src="/logo.svg" alt="" className="mr-2 h-6 w-6" />
          Morocco By Rasha
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Verify your email to unlock all features and stay updated."
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  )
} 