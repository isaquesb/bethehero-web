import React, { useState } from 'react'
import api from '../../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import logo from '../../assets/img/logo.svg'
import type { CreateOngRequest, CreateOngResponse } from '../../types/api'
import './styles.css'

export default function Register(): React.JSX.Element {
  const navigate = useNavigate()
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [cellphone, setCellphone] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [uf, setUf] = useState<string>('')
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data: CreateOngRequest = {
      name,
      email,
      cellphone,
      city,
      uf
    }
    try {
      const response = await api.post<CreateOngResponse>('ongs', data)
      alert(`Seu ID de acesso: ${response.data.id}`)
      navigate('/')
    } catch (err) {
      alert('Erro no cadastro. Tente novamente.')
    }
  }
  return (
    <div className="register-container">
      <div className="content">
        <section className="form">
          <img src={logo} alt="Be The Hero" />
          <h1>Cadastro</h1>
          <p>Faça seu cadastro</p>
          <Link to="/" className="backlink">
                <FiArrowLeft size="16" color="#e02041" />
                Voltar para o logon
            </Link>
        </section>
        <form onSubmit={handleRegister}>
            <input
              placeholder="Nome da Ong"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
               />
            <input
              placeholder="Celular"
              value={cellphone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCellphone(e.target.value)}
              />
            <div className="input-group">
              <input
                placeholder="Cidade"
                value={city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                />
              <input
                placeholder="UF"
                value={uf}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUf(e.target.value)}
                style={{width: 80}} />
            </div>
            <button type="submit" className="button">Cadastrar</button>
          </form>
        </div>
    </div>
  )
}
