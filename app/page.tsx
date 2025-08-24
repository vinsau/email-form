"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, Users } from "lucide-react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [subscriberCount] = useState(2847)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError("")

    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_NEWSLETTER_API_ENDPOINT
      
      if (!apiEndpoint) {
        throw new Error("Newsletter API endpoint not configured")
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Newsletter subscription successful:', result)
      
      setIsSubmitted(true)
      setEmail("")
    } catch (err) {
      console.error('Newsletter subscription failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-card-foreground">Stay Updated</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Get the latest news and updates delivered straight to your inbox
            </CardDescription>
            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{subscriberCount.toLocaleString()} people already subscribed</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-secondary" />
              </div>
              <div>
                  <h3 className="text-lg font-medium text-card-foreground">Thank you for subscribing!</h3>
                  <p className="text-muted-foreground text-sm mt-1">We&apos;ll send you our best content weekly</p>
              </div>
              <Button variant="outline" onClick={() => {
                setIsSubmitted(false)
                setError("")
              }} className="w-full">
                Subscribe Another Email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-input border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Subscribing...
                  </div>
                ) : (
                  "Subscribe to Newsletter"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">No spam, unsubscribe at any time</p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
