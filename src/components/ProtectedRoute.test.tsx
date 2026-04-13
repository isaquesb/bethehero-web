// REQ-WEB-06: ProtectedRoute guards access to authenticated pages
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

function renderWithRoute(hasToken: boolean) {
  if (hasToken) {
    localStorage.setItem('token', 'abc123')
  } else {
    localStorage.removeItem('token')
  }

  return render(
    <MemoryRouter initialEntries={['/profile']}>
      <Routes>
        <Route path="/" element={<div>Login Page</div>} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>Profile Page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute (REQ-WEB-06)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('REQ-WEB-06: renders children when token is present in localStorage', () => {
    renderWithRoute(true)

    expect(screen.getByText('Profile Page')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('REQ-WEB-06: redirects to / when no token in localStorage', () => {
    renderWithRoute(false)

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Profile Page')).not.toBeInTheDocument()
  })
})
