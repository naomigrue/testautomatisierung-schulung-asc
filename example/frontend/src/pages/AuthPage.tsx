import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiError, signin, signup } from '../api'
import { setUsername as saveUsername } from '../auth'

export default function AuthPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function formatAuthError(err: ApiError): string {
    if (err.code === 'VALIDATION_ERROR' && err.fields && Object.keys(err.fields).length > 0) {
      return Object.values(err.fields).join(' ')
    }
    return err.message
  }

  async function handleSubmit(action: 'signup' | 'signin') {
    setError('')
    setLoading(true)
    try {
      const result = action === 'signup'
        ? await signup(username, password)
        : await signin(username, password)
      saveUsername(result.username)
      navigate('/welcome')
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(event: FormEvent, action: 'signup' | 'signin') {
    event.preventDefault()
    void handleSubmit(action)
  }

  return (
    <main className="card">
      <h1>Example App</h1>
      <p className="subtitle">Register or sign in to continue</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          data-testid="username-input"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          data-testid="password-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <div data-testid="auth-error" className="error" role="alert">
          {error}
        </div>

        <div className="actions">
          <button
            type="button"
            data-testid="signup-button"
            disabled={loading}
            onClick={(e) => onSubmit(e, 'signup')}
          >
            Sign up
          </button>
          <button
            type="button"
            data-testid="signin-button"
            disabled={loading}
            onClick={(e) => onSubmit(e, 'signin')}
          >
            Sign in
          </button>
        </div>
      </form>
    </main>
  )
}
