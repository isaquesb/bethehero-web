// REQ-WEB-03, REQ-WEB-05, REQ-WEB-07: Profile page tests
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

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
import Profile from './index'

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

const fakeOng = {
  id: 'abc12345',
  name: 'ONG Test',
  cellphone: '11999999999',
  email: 'ong@test.com',
  city: 'SP',
  uf: 'SP',
  created_at: '2026-01-01T00:00:00Z',
}

const fakeIncident = (id: number, value = '100.50') => ({
  id,
  title: `Caso ${id}`,
  description: `Desc ${id}`,
  value,
  created_at: '2026-01-01T00:00:00Z',
  ong: fakeOng,
})

function renderProfile() {
  return render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  )
}

describe('Profile page (REQ-WEB-03, REQ-WEB-05)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    localStorage.setItem('token', 'tok123')
    localStorage.setItem('userName', 'Org Name')
  })

  it('REQ-WEB-03: renders empty state with greeting and "Nenhum caso cadastrado"', async () => {
    mockApi.get.mockResolvedValueOnce({ data: [] })

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('Bem vinda, Org Name')).toBeInTheDocument()
    })

    expect(screen.getByText('Casos Cadastrados')).toBeInTheDocument()
    expect(screen.getByText('Nenhum caso cadastrado')).toBeInTheDocument()

    // Verify correct API call: endpoint + Authorization header (raw ong_id, no Bearer)
    expect(mockApi.get).toHaveBeenCalledWith('profile/incidents', {
      headers: { Authorization: 'tok123' },
    })
  })

  it('REQ-WEB-03: renders incidents list with BRL currency format', async () => {
    mockApi.get.mockResolvedValueOnce({
      data: [fakeIncident(1, '100.50'), fakeIncident(2, '250.00')],
    })

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('Caso 1')).toBeInTheDocument()
    })

    expect(screen.getByText('Caso 2')).toBeInTheDocument()
    // BRL format: 100.50 → R$ 100,50 (may have non-breaking space)
    expect(screen.getByText(/100,50/)).toBeInTheDocument()
    expect(screen.getByText(/250,00/)).toBeInTheDocument()
    expect(mockApi.get).toHaveBeenCalledWith('profile/incidents', {
      headers: { Authorization: 'tok123' },
    })
  })

  it('REQ-WEB-05: delete success — calls DELETE /incidents/:id with Authorization, removes item from DOM', async () => {
    mockApi.get.mockResolvedValueOnce({ data: [fakeIncident(1)] })
    mockApi.delete.mockResolvedValueOnce({})

    const user = userEvent.setup()

    renderProfile()

    // Wait for the incident to appear
    await waitFor(() => {
      expect(screen.getByText('Caso 1')).toBeInTheDocument()
    })

    // Find and click the trash button (the only button associated with the incident)
    const trashButtons = screen.getAllByRole('button')
    // The delete button is after the logout button — find by test proximity
    // Profile has: logout button (FiPower) + one trash button per incident
    const trashButton = trashButtons[trashButtons.length - 1]
    await user.click(trashButton)

    await waitFor(() => {
      expect(mockApi.delete).toHaveBeenCalledWith('incidents/1', {
        headers: { Authorization: 'tok123' },
      })
    })

    // Item removed from DOM
    await waitFor(() => {
      expect(screen.queryByText('Caso 1')).not.toBeInTheDocument()
    })
  })

  it('REQ-WEB-05: delete failure — shows "Erro ao remover caso" alert, item stays in DOM', async () => {
    mockApi.get.mockResolvedValueOnce({ data: [fakeIncident(1)] })
    mockApi.delete.mockRejectedValueOnce(new Error('Server Error'))

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const user = userEvent.setup()

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('Caso 1')).toBeInTheDocument()
    })

    const trashButtons = screen.getAllByRole('button')
    const trashButton = trashButtons[trashButtons.length - 1]
    await user.click(trashButton)

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro ao remover caso')
    })

    // Item still in DOM after failure
    expect(screen.getByText('Caso 1')).toBeInTheDocument()

    alertSpy.mockRestore()
  })

  it('REQ-WEB-07: logout clears localStorage and navigates to /', async () => {
    mockApi.get.mockResolvedValueOnce({ data: [] })

    const user = userEvent.setup()

    renderProfile()

    await waitFor(() => {
      expect(screen.getByText('Bem vinda, Org Name')).toBeInTheDocument()
    })

    // The logout button is the one with FiPower icon — it's the first button in the header
    const buttons = screen.getAllByRole('button')
    // Logout button is in the header (first button rendered before any trash buttons)
    const logoutButton = buttons[0]
    await user.click(logoutButton)

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('userName')).toBeNull()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
