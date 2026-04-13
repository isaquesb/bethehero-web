// REQ-WEB-02: Register page tests
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
import Register from './index'

const mockApi = api as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  delete: ReturnType<typeof vi.fn>
}

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )
}

describe('Register page (REQ-WEB-02)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('REQ-WEB-02: renders all five input placeholders, Cadastrar button, and back link', () => {
    renderRegister()

    expect(screen.getByPlaceholderText('Nome da Ong')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Celular')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Cidade')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('UF')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument()
    expect(screen.getByText(/Voltar para o logon/)).toBeInTheDocument()
  })

  it('REQ-WEB-02: success path — calls POST /ongs with all 5 fields, shows ID alert, navigates to /', async () => {
    const user = userEvent.setup()
    mockApi.post.mockResolvedValueOnce({ data: { id: 'newhex1' } })

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    renderRegister()

    await user.type(screen.getByPlaceholderText('Nome da Ong'), 'ONG Exemplo')
    await user.type(screen.getByPlaceholderText('Email'), 'ong@exemplo.com')
    await user.type(screen.getByPlaceholderText('Celular'), '11988887777')
    await user.type(screen.getByPlaceholderText('Cidade'), 'São Paulo')
    await user.type(screen.getByPlaceholderText('UF'), 'SP')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('ongs', {
        name: 'ONG Exemplo',
        email: 'ong@exemplo.com',
        cellphone: '11988887777',
        city: 'São Paulo',
        uf: 'SP',
      })
      expect(alertSpy).toHaveBeenCalledWith('Seu ID de acesso: newhex1')
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })

    alertSpy.mockRestore()
  })

  it('REQ-WEB-02: failure path — shows "Erro no cadastro" alert on API error', async () => {
    const user = userEvent.setup()
    mockApi.post.mockRejectedValueOnce(new Error('Server Error'))

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    renderRegister()

    await user.type(screen.getByPlaceholderText('Nome da Ong'), 'ONG Falha')
    await user.type(screen.getByPlaceholderText('Email'), 'fail@test.com')
    await user.type(screen.getByPlaceholderText('Celular'), '11000000000')
    await user.type(screen.getByPlaceholderText('Cidade'), 'RJ')
    await user.type(screen.getByPlaceholderText('UF'), 'RJ')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Erro no cadastro. Tente novamente.')
    })

    alertSpy.mockRestore()
  })
})
