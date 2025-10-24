'use client'

import React from 'react'

type LoginResult = {
  message?: string
  error?: string
  errors?: { message?: string }[]
}

export default function LoginForm() {
  const emailField = React.useRef<HTMLInputElement>(null)
  const passwordField = React.useRef<HTMLInputElement>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const email = emailField.current?.value.trim() ?? ''
    const password = passwordField.current?.value ?? ''

    if (!email || !password) {
      setError('Please enter your email and password.')
      emailField.current?.focus()
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/users/login', {
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      let result: LoginResult | null = null
      try {
        result = (await response.json()) as LoginResult
      } catch {
        result = null
      }

      if (!response.ok) {
        const message =
          (result && (result.message || result.error || result.errors?.[0]?.message)) ||
          'Unable to sign in with those credentials.'

        setError(message)
        return
      }

      window.location.replace('/')
    } catch (_error) {
      setError('Connection failed, please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <div className="authField">
        <label htmlFor="email">Email</label>
        <input
          autoComplete="email"
          id="email"
          name="email"
          ref={emailField}
          required
          type="email"
        />
      </div>

      <div className="authField">
        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          ref={passwordField}
          required
          type="password"
        />
      </div>

      {error && <p className="authError">{error}</p>}

      <button className="authSubmit" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
