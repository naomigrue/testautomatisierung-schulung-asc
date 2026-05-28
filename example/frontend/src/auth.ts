const USERNAME_KEY = 'auth_username'

export function getUsername(): string | null {
  return sessionStorage.getItem(USERNAME_KEY)
}

export function setUsername(username: string): void {
  sessionStorage.setItem(USERNAME_KEY, username)
}

export function clearUsername(): void {
  sessionStorage.removeItem(USERNAME_KEY)
}

export function isAuthenticated(): boolean {
  return getUsername() !== null
}
