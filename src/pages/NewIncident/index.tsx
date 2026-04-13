import React, { useState } from 'react'
import api from '../../services/api'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import logo from '../../assets/img/logo.svg'
import type { CreateIncidentRequest, CreateIncidentResponse } from '../../types/api'
import './styles.css'

export default function NewIncident(): React.JSX.Element {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [value, setValue] = useState<string>('')
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data: CreateIncidentRequest = {
      title,
      description,
      value
    }
    try {
      await api.post<CreateIncidentResponse>('incidents', data, {
          headers: {
              Authorization: token
          }
      })
      alert(`Caso cadastrado com sucesso.`)
      navigate('/profile')
    } catch (err) {
      alert('Erro no cadastro. Tente novamente.')
    }
  }
  return (
    <div className="ni-container">
      <div className="content">
        <section className="form">
          <img src={logo} alt="Be The Hero" />
          <h1>Cadastrar novo Caso</h1>
          <p>Descreva o caso detalhadamente para encontrar um herói para resolver isso.</p>
          <Link to="/profile" className="backlink">
                <FiArrowLeft size="16" color="#e02041" />
                Voltar para a home
          </Link>
        </section>
        <form onSubmit={handleSubmit}>
            <input
              placeholder="Titulo do Caso"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
            <textarea
              rows={5}
              placeholder="Descrição"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              ></textarea>
            <input
              placeholder="Valor em reais"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
               />
            <button type="submit" className="button">Cadastrar</button>
          </form>
        </div>
    </div>
  )
}
