import { describe, it, expect } from 'vitest'
import api from './api'

describe('api service', () => {
  it('REQ-WEB-09: exports an axios instance with a configured baseURL', () => {
    expect(api.defaults.baseURL).toBeTruthy()
    expect(typeof api.defaults.baseURL).toBe('string')
    // In test env, VITE_API_URL is unset → fallback to 'http://localhost:3333'
    expect(api.defaults.baseURL).toMatch(/localhost:3333|http/)
  })
})
