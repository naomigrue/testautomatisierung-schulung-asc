const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export type AuthResult = {
  username: string
}

export type ApiErrorBody = {
  error: string
  message: string
  fields?: Record<string, string>
}

export class ApiError extends Error {
  readonly code: string
  readonly fields?: Record<string, string>

  constructor(body: ApiErrorBody) {
    super(body.message)
    this.code = body.error
    this.fields = body.fields
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json()) as ApiErrorBody
    throw new ApiError(body)
  }
  return response.json() as Promise<T>
}

export async function signup(username: string, password: string): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return parseJson<AuthResult>(response)
}

export async function signin(username: string, password: string): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return parseJson<AuthResult>(response)
}
