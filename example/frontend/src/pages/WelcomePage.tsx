import { useNavigate } from 'react-router-dom'
import { clearUsername, getUsername } from '../auth'

export default function WelcomePage() {
  const navigate = useNavigate()
  const username = getUsername() ?? ''

  function handleSignOut() {
    clearUsername()
    navigate('/')
  }

  return (
    <main className="card">
      <h1 data-testid="welcome-message">Welcome, {username}!</h1>
      <button type="button" data-testid="signout-button" onClick={handleSignOut}>
        Sign out
      </button>
    </main>
  )
}
