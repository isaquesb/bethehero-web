import React, { useState } from 'react';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import logo from '../../assets/img/logo.svg';
import './style.css';

function Register({ children }) {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cellphone, setCellphone] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  async function handleRegister(e) {
    e.preventDefault();
    const data = {
      name,
      email,
      cellphone,
      city,
      uf
    }
    try {
      const response = await api.post('ongs', data);
      alert(`Seu ID de acesso: ${response.data.id}`);
      history.push('/');
    } catch (err) {
      alert('Erro no cadastro. Tente novamente.');
    }
  };
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
              onChange={e => {setName(e.target.value)}}
              />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => {setEmail(e.target.value)}}
               />
            <input
              placeholder="Celular"
              value={cellphone}
              onChange={e => {setCellphone(e.target.value)}}
              />
            <div className="input-group">
              <input
                placeholder="Cidade"
                value={city}
                onChange={e => {setCity(e.target.value)}}
                />
              <input
                placeholder="UF"
                value={uf}
                onChange={e => {setUf(e.target.value)}}
                style={{width: 80}} />
            </div>
            <button type="submit" className="button">Cadastrar</button>
          </form>
        </div>
    </div>
  );
}

export default Register;
