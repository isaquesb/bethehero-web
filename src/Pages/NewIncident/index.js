import React, { useState } from 'react';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import logo from '../../assets/img/logo.svg';
import './style.css';

function NewIncident({ children }) {
  const history = useHistory();
  const token  = localStorage.getItem('token');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      value
    }
    try {
      await api.post('incidents', data, {
          headers: {
              Authorization: token
          }
      }).then(response => {
        alert(`Caso cadastrado com sucesso.`);
        history.push('/profile');
      });
    } catch (err) {
      alert('Erro no cadastro. Tente novamente.');
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
              onChange={e => {setTitle(e.target.value)}}
              />
            <textarea
              rows="5"
              placeholder="Descrição"
              value={description}
              onChange={e => {setDescription(e.target.value)}}
              ></textarea>
            <input
              placeholder="Valor em reais"
              value={value}
              onChange={e => {setValue(e.target.value)}}
               />
            <button type="submit" className="button">Cadastrar</button>
          </form>
        </div>
    </div>
  );
}

export default NewIncident;
