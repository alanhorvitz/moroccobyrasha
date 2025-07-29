'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setEmail('')
      toast({
        title: 'Successfully subscribed!',
        description: 'Thank you for subscribing to our newsletter. You\'ll receive the latest travel tips and exclusive offers.',
      })
    }, 1000)
  }

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Mail className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
            <p className="text-primary-foreground/90 text-lg">
              Subscribe to our newsletter and receive exclusive travel tips, special offers, and the latest updates on Morocco's hidden gems.
            </p>
          </div>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Join Our Travel Community</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Get insider access to the best of Morocco
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
              <p className="text-xs text-primary-foreground/70 mt-4">
                By subscribing, you agree to receive marketing communications from us. 
                You can unsubscribe at any time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}