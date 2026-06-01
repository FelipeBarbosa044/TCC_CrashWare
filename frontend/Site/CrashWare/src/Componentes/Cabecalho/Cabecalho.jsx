import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoBranca from '../../fotos/escuro/logo_sem_fundo.svg';
import logoEscura from '../../fotos/claro/logo_sem_fundo.svg';
import Style from './Cabecalho.module.css';

//Functions
import { handleRedirect } from '../../../funcoes/functions';
import { Tema } from '../Tema';

const Cabecalho = ({ children }) => {

  const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');

  useEffect(() => {
    const checarTema = (e) => setTema(e.detail);
    window.addEventListener('temaAtualizado', checarTema);
    
    return () => window.removeEventListener('temaAtualizado', checarTema);
  }, []);

  const isClaro = tema === 'Claro';
  const Navegacao = useNavigate();

  return (
    <>
        <header className={Style.Cabecalho}>
          <div className={Style.infoCabecalho}>
            <Link to="#" onClick={(e) => {
              e.preventDefault()
              handleRedirect(Navegacao)
            }}>
              <img 
                className={Style.logo_legal} 
                src={isClaro ? logoEscura : logoBranca} 
                alt="Logo do CrashWare" 
              />
              <h5>CRASHWARE</h5>
            </Link>
          </div>
          {children}
        </header>
    </>
  );
};

export { Cabecalho };