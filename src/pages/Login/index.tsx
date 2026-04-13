import React, { useState } from 'react'
import api from '../../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { FiLogIn } from 'react-icons/fi'
import logo from '../../assets/img/logo.svg'
import heroesImage from '../../assets/img/heroes.png'
import type { LoginResponse } from '../../types/api'
import './styles.css'

export default function Login(): React.JSX.Element {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      const response = await api.post<LoginResponse>('auth/login', { email })
      localStorage.setItem('token', response.data.id)
      localStorage.setItem('userName', response.data.name)
      navigate('/profile')
    } catch (err) {
      console.log(err)
      alert('Falha no login')
    }
  }
  return (
    <div className="login-container">
      <section className="form">
        <img src={logo} alt="Be The Hero" />
        <form onSubmit={handleSubmit}>
          <h1>Informe seu Login</h1>
          <input
            type="email"
            placeholder="Seu E-mail"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          <button type="submit" className="button">Entrar</button>
          <Link to="/register" className="backlink">
              <FiLogIn size="16" color="#e02041" />
            Não tenho cadastro
          </Link>
        </form>
      </section>
      <img src={heroesImage} alt="Heroes" />
    </div>
  )
}
