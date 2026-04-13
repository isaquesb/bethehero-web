// REQ-WEB-04: NewIncident page tests
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
import NewIncident from './index'

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

function renderNewIncident() {
  return render(
    <MemoryRouter>
      <NewIncident />
    </MemoryRouter>
  )
}

describe('NewIncident page (REQ-WEB-04)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('REQ-WEB-04: renders title, description, value inputs, Cadastrar button, and back link', () => {
    renderNewIncident()

    expect(screen.getByPlaceholderText('Titulo do Caso')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Descrição')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Valor em reais')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument()
    expect(screen.getByText(/Voltar para a home/)).toBeInTheDocument()
  })

  it('REQ-WEB-04: success path — calls POST /incidents with Authorization header, shows alert, navigates to /profile', async () => {
    localStorage.setItem('token', 'tok123')
    mockApi.post.mockResolvedValueOnce({ data: { id: 42 } })

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const user = userEvent.setup()

    renderNewIncident()

    await user.type(screen.getByPlaceholderText('Titulo do Caso'), 'Caso Teste')
    await user.type(screen.getByPlaceholderText('Descrição'), 'Descrição do caso teste')
    await user.type(screen.getByPlaceholderText('Valor em reais'), '150.00')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith(
        'incidents',
        { title: 'Caso Teste', description: 'Descrição do caso teste', value: '150.00' },
        { headers: { Authorization: 'tok123' } }
      )
      expect(alertSpy).toHaveBeenCalledWith('Caso cadastrado com sucesso.')
      expect(mockNavigate).toHaveBeenCalledWith('/profile')
    })

    alertSpy.mockRestore()
  })

  it('REQ-WEB-04: failure path — shows "Erro no cadastro" alert on API error', async () => {
    localStorage.setItem('token', 'tok123')
    mockApi.post.mockRejectedValueOnce(new Error('Server Error'))

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const user = userEvent.setup()

    renderNewIncident()

    await user.type(screen.getByPlaceholderText('Titulo do Caso'), 'Caso Falha')
    await user.type(screen.getByPlaceholderText('Descrição'), 'Desc')
    await user.type(screen.getByPlaceholderText('Valor em reais'), '50.00')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro no cadastro. Tente novamente.')
    })

    alertSpy.mockRestore()
  })
})
