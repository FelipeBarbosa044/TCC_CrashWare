import { Link, useLocation } from 'react-router-dom';
import Style from './Sidebar.module.css';
import { Tema } from '../../Tema';
import { useState, useEffect } from 'react';

import admIconEscuro from "../../../fotos/maletaClaro.svg";
import admIconClaro from "../../../fotos/maleta.svg";

import perfilIconEscuro from "../../../fotos/escuro/login_icon.svg";
import perfilIconClaro from "../../../fotos/claro/login_icon_claro.svg";

import configuracoesIconEscuro from "../../../fotos/escuro/configuracoes_icon.svg";
import configuracoesIconClaro from "../../../fotos/claro/configuracoes_icon_claro.svg";

const Sidebar = ({ aberto, onFechar }) => {
  const location = useLocation();

  const [dados] = useState(() =>
    JSON.parse(localStorage.getItem("dados")) || null
  );

  const [temaEscuro, setTemaEscuro] = useState(
    () => (localStorage.getItem('TemaSelecionado') || 'Claro') === 'Escuro'
  );

  useEffect(() => {
    const handleTema = (e) => {
      setTemaEscuro(e.detail === 'Escuro');
    };

    window.addEventListener('temaAtualizado', handleTema);
    return () => window.removeEventListener('temaAtualizado', handleTema);
  }, []);

  const admin = dados?.adm;

  const links = [
    {to: '/perfil', alt: 'Perfil'},
    {to: '/configuracoes', alt: 'Configurações'}
  ];

  if (admin === true) {
    links.push({
      to: '/relatorio',
      alt: 'ADM'
    });
  }

  return (
    <>
      <div
        className={`${Style.overlay} ${aberto ? Style.overlayOpen : ''}`}
        onClick={onFechar}
      />

      <aside className={`${Style.sidebar} ${aberto ? Style.sidebarOpen : ''}`}>
        <nav>
          {links.map(({ srcEscuro, srcClaro, to, alt }) => (
            <Link
              key={to}
              to={to}
              className={`${Style.link} ${location.pathname === to ? Style.active : ''}`}
              onClick={onFechar}
            >
              <p>{alt}</p>
            </Link>
          ))}

          <Tema />
        </nav>
      </aside>
    </>
  );
};

export { Sidebar };