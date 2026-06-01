import { Link, useLocation, useNavigate } from 'react-router-dom';
import Style from './Sidebar.module.css';
import { Tema } from '../../Tema';
import { Usuario } from '../../../../funcoes/user';
import { useState } from 'react';

const Sidebar = ({ aberto, onFechar }) => {
    //Navegação --> Permite eu levar o usuario para outras telas
    const Navegacao = useNavigate();

    const token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refresh_token");

    //Uso useState para o react renderizar as informações
    const [token_state, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
    const [dados, setDados] = useState(() =>
        JSON.parse(localStorage.getItem("dados")) || null
    );

    //Lista que contém todos os usestate
    const set = [setToken,setRefresh,setDados];


    //Pego as informações do usuario
    let usuario = JSON.parse(localStorage.getItem("dados"));

    //Pego o valor do adm
    const admin = usuario?.adm;

    const location = useLocation();

    const links = [
      { label: 'perfil', to: '/perfil'},
      { label: 'Configurações', to: '/configuracoes' }
    ];



    if(admin == true)
    {
      links.push({ label: 'ADM', to: '/relatorio' })
    }
  

  return (
    <>
      <div
        className={`${Style.overlay} ${aberto ? Style.overlayOpen : ''}`}
        onClick={onFechar}
      />

      <aside className={`${Style.sidebar} ${aberto ? Style.sidebarOpen : ''}`}>

        <nav>
          {links.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`${Style.link} ${location.pathname === to ? Style.active : ''}`}
              onClick={onFechar}
            >
              {label}
            </Link>
          ))}

          <Tema />
        </nav>

      </aside>
    </>
  );
};

export { Sidebar };