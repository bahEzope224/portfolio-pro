import { useState, useCallback } from 'react'
import api from '@/lib/api'
import type { Token, AdminUser } from '@/types'

const TOKEN_KEY = 'portfolio_token'

// ── Simple auth helpers (no external state library needed) ───────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export async function loginRequest(username: string, password: string): Promise<Token> {
  const form = new URLSearchParams()
  form.append('username', username)
  form.append('password', password)
  const { data } = await api.post<Token>('/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  return data
}

export async function fetchMe(): Promise<AdminUser> {
  const { data } = await api.get<AdminUser>('/auth/me')
  return data
}
