import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, signin, signup } from './api'

describe('api client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('signup returns auth result on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ username: 'alice' }),
    } as Response)

    const result = await signup('alice', 'password123')

    expect(result).toEqual({ username: 'alice' })
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/signup'),
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('signin throws ApiError on invalid credentials', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'INVALID_CREDENTIALS',
        message: 'Username or password is incorrect.',
      }),
    } as Response)

    await expect(signin('alice', 'wrong')).rejects.toSatisfy((err: unknown) => {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).code).toBe('INVALID_CREDENTIALS')
      return true
    })
  })
})
