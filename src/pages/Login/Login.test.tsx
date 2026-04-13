// REQ-WEB-01, REQ-WEB-07, REQ-WEB-08: Login page tests
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// vi.mock is hoisted — must be at top level before imports of the mocked modules
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

import api from '../../services/api'
import Login from './index'

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe('Login page (REQ-WEB-01, REQ-WEB-07, REQ-WEB-08)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('REQ-WEB-01: renders email input, Entrar button, and registration link', () => {
    renderLogin()

    expect(screen.getByPlaceholderText('Seu E-mail')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    expect(screen.getByText(/Não tenho cadastro/)).toBeInTheDocument()
  })

  it('REQ-WEB-07: success path — stores token + userName in localStorage, navigates to /profile, calls correct endpoint', async () => {
    const user = userEvent.setup()
    const fakeOng = {
      id: 'abc12345',
      name: 'ONG Test',
      cellphone: '11999999999',
      email: 'ong@test.com',
      city: 'SP',
      uf: 'SP',
      created_at: '2026-01-01T00:00:00Z',
    }
    mockApi.post.mockResolvedValueOnce({ data: fakeOng })

    renderLogin()

    await user.type(screen.getByPlaceholderText('Seu E-mail'), 'ong@test.com')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('auth/login', { email: 'ong@test.com' })
      expect(localStorage.getItem('token')).toBe('abc12345')
      expect(localStorage.getItem('userName')).toBe('ONG Test')
      expect(mockNavigate).toHaveBeenCalledWith('/profile')
    })
  })

  it('REQ-WEB-08: failure path — shows "Falha no login" alert and leaves localStorage empty', async () => {
    const user = userEvent.setup()
    mockApi.post.mockRejectedValueOnce(new Error('Unauthorized'))

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    renderLogin()

    await user.type(screen.getByPlaceholderText('Seu E-mail'), 'wrong@test.com')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Falha no login')
    })

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('userName')).toBeNull()

    alertSpy.mockRestore()
  })
})
