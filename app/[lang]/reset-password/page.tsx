'use client'

import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { useSearchParams } from 'next/navigation'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  if (!token) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Invalid Reset Link</h1>
          <p className="text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
          <a
            href="/forgot-password"
            className="mt-4 inline-block underline underline-offset-4 hover:text-primary"
          >
            Request a new reset link
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <ResetPasswordForm token={token} />
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
              "Choose a strong password to keep your account secure."
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  )
} 