import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';
import logo from '../../assets/img/logo.svg';
import './style.css';

export default function Profile() {
    const history = useHistory();
    const name = localStorage.getItem('userName');
    const token  = localStorage.getItem('token');
    const [incidents, setIncidents] = useState([]);
    useEffect(() => {
        api.get('profile/incidents', {
            headers: {
                Authorization: token
            }
        }).then(response => {
            setIncidents(response.data);
        })
    }, [token]);
    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: token
                }
            });
            setIncidents(incidents.filter(row => row.id !== id));
        } catch (err) {
            alert('Erro ao remover caso');
        }
    }
    function handleLogout() {
        localStorage.clear();
        history.push('/');
    }
    return (
        <div className="profile-container">
          <header>
            <img src={logo} alt="Be The Hero" />  
            <span>Bem vinda, {name}</span>
            <Link to="/incidents/new" className="button">Cadastrar novo caso</Link>
            <button onClick={handleLogout}>
                <FiPower size="18" color="#E02041" />
            </button>
          </header>

            <h1>Casos Cadastrados</h1>

            { 0 === incidents.length &&
                <p>Nenhum caso cadastrado</p>
            }
            { incidents.length > 0 && <ul>
                { incidents.map(row => (
                    <li key={row.id}>
                        <strong>Caso: </strong>
                        <p>{row.title}</p>

                        <strong>Descri&ccedil;&atilde;o</strong>
                        <p>{row.description}</p>

                        <strong>Valor</strong>
                        <p>{ Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(row.value)}</p>

                        <button
                            onClick={() => {handleDeleteIncident(row.id)}}
                        >
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                )) }
            </ul> }
        </div>
      );
};
