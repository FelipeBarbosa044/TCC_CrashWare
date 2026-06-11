import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Cabecalho, LinksCabecalho, Rodape, Tema } from "../../Componentes";
import { Sidebar } from '../../Componentes/Cabecalho/barraLateral/sideBar';

import logoBranca from '../../fotos/escuro/logo_sem_fundo.svg';
import logoEscura from '../../fotos/claro/logo_sem_fundo.svg';

import Instagram from "../../fotos/Instagram.svg"
import Whatsapp from "../../fotos/Whatsapp.svg"
import GitHub from "../../fotos/GitHub.svg"
import Style from './LayoutPadrao.module.css'

const LayoutPadrao = () => {

    const DataATual = new Date().getFullYear();
    const [aberto, setAberto] = useState(false);

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
            <Cabecalho>
                <Tema/>
            </Cabecalho>
            <Outlet />
            <Rodape>
                < div className={Style.corpo} >
                    <footer className={Style.Rodape}>
                        <div className={Style.Container}>
                            <div className={Style.Marca}>
                                <Link to="/">
                                <img 
                                className={Style.logo_legal} 
                                src={isClaro ? logoEscura : logoBranca} 
                                alt="Logo do CrashWare" 
                                />
                                    <h4>CRASHWARE</h4>
                                </Link>
                                <p>Plataforma de Aprendizado de Hardware e Software</p>
                            </div>

                            {/* <div className={Style.Colunas}> */}
                                <div className={Style.RedesSociais}>
                                    <h5>Redes Sociais</h5>
                                    <div className={Style.Tamanho}>
                                        <a href="https://www.instagram.com/nesferaz/" target='_blank'>
                                            <img src={Instagram} alt="Instagram de um dos criadores" />
                                        </a>
                                            <a href="https://github.com/FelipeBarbosa044/TCC_CrashWare" target='_blank'>
                                            <img src={GitHub} alt="GitHub do TCC" />
                                        </a>
                                    </div>
                                </div> {/* RedesSociais */}

                                <div className={Style.informacoes}>

                                    <h5>Informações</h5>
                                    <Link to='sobre'>
                                        <p>Sobre Nós</p>
                                    </Link>

                                    <Link to="*">
                                        <p>Politica de Privacidade</p>
                                    </Link>
                                </div>
                            {/* </div> */}

                        </div>

                        <div className={Style.Copy}>
                            <p> ©{DataATual} Crashware. Todos os diretos reservados à equipe de desenvolvimento </p>
                        </div>

                    </footer>
                </div >
            </Rodape>
        </>
    );
};

export { LayoutPadrao };