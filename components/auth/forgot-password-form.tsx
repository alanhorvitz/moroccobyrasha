import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export function ForgotPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to send reset email')
      }

      setSuccess(true)
    } catch (error) {
      console.error('Password reset error:', error)
      form.setError('email', {
        type: 'manual',
        message: 'Failed to send reset email. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{t('auth.forgotPassword.successTitle')}</h2>
        <p className="text-muted-foreground">
          {t('auth.forgotPassword.successMessage')}
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('auth.forgotPassword.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.forgotPassword.description')}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.fields.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? t('common.sending') 
              : t('auth.forgotPassword.submit')}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <a
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          {t('auth.forgotPassword.backToLogin')}
        </a>
      </div>
    </div>
  )
} 