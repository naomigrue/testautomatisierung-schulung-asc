import { beforeEach, describe, expect, it } from 'vitest'
import { clearUsername, getUsername, isAuthenticated, setUsername } from './auth'

describe('auth storage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('stores and retrieves username', () => {
    setUsername('alice')
    expect(getUsername()).toBe('alice')
    expect(isAuthenticated()).toBe(true)
  })

  it('clears username on sign out', () => {
    setUsername('alice')
    clearUsername()
    expect(getUsername()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })
})
