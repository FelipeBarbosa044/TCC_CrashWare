import { Outlet, Link } from "react-router-dom"
import { useState } from "react";
import { Cabecalho, LinksCabecalho, Rodape, Tema } from "../../Componentes";
import { Sidebar } from '../../Componentes/Cabecalho/barraLateral/sideBar';
import Logo from '../../Logo/logo_sem_fundo.png';
import Instagram from "../../fotos/Instagram.svg"
import Whatsapp from "../../fotos/Whatsapp.svg"
import GitHub from "../../fotos/GitHub.svg"
import Style from './LayoutPadrao.module.css'

const LayoutPadrao = () => {

    const DataATual = new Date().getFullYear();
    const [aberto, setAberto] = useState(false);


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
                                    <img src={Logo} alt="" />
                                    <h4>CRASHWARE</h4>
                                </Link>
                                <p>Plataforma de Aprendizado de Hardware e Software</p>
                            </div>

                            <div className={Style.Colunas}>
                                <div className={Style.RedesSociais}>
                                    <h5>Redes Sociais</h5>
                                    <div className={Style.Tamanho}>
                                        <a href="https://www.instagram.com/thesousac/" target='_blank'>
                                            <img src={Instagram} alt="" />
                                        </a>
                                        <a href="https://wa.me/5511992603770?text=Você%20é%20um%20BETA" target="_blank">
                                        <img src={Whatsapp} alt="" />
                                        </a>
                                        <img src={GitHub} alt="" />
                                    </div>
                                </div> {/* RedesSociais */}

                                <div className={Style.informacoes}>

                                    <h5>Informações</h5>
                                    <Link to='sobre-nos'>
                                        <p>Sobre Nós</p>
                                    </Link>

                                    <Link to="*">
                                        <p>Politica de Privacidade</p>
                                    </Link>
                                </div>
                            </div>

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