import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { session, loading: authLoading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (authLoading) return null
  if (session) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError('Giriş başarısız. E-posta veya şifre hatalı.')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Giriş yap</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Giriş yapılıyor...' : 'Giriş yap'}
          </button>
        </form>
      </div>
    </div>
  )
}
