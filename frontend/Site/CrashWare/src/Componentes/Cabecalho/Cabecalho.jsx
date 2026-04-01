import { useState } from 'react';
import Logo from '../../Logo/logo_sem_fundo.png';
import { Tema } from '../Tema';
import { Link } from 'react-router-dom';

import Style from './Cabecalho.module.css';

const Cabecalho = () => {
  const [scrolled, setScrolled] = useState(false)

  return (
    <>
      <div className={`${Style.Cabecalho} ${scrolled ? Style.Scrolled : ''}`}>
        <Link to="/">
          <img className={Style.logo_legal} src={Logo} alt="" />
          <h5>CRASHWARE</h5>
        </Link>

        <div className={Style.Direita}>
          <Tema />
        </div>
      </div>
    </>
  );
};

export { Cabecalho };