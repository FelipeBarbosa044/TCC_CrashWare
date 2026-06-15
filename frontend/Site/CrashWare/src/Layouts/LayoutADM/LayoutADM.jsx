import { Sidebar } from '../../Componentes/Cabecalho/barraLateral/sideBar';
import { Outlet, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Cabecalho, Tema } from "../../Componentes"

import Seta from '../../fotos/Seta.png';

import perfilModoClaro from "../../fotos/claro/login_icon_claro.svg";
import perfilModoEscuro from "../../fotos/escuro/login_icon.svg";

import sairContaModoClaro from "../../fotos/claro/sairConta.svg";
import sairContaModoEscuro from "../../fotos/escuro/sairConta.svg";

import desativarConta from "../../fotos/desativarConta.svg";
import excluirConta from "../../fotos/excluirConta.svg";

import sobreModoClaro from "../../fotos/claro/Sobre.svg";
import sobreModoEscuro from "../../fotos/escuro/Sobre.svg";

import termosModoClaro from "../../fotos/claro/termos.svg";
import termosModoEscuro from "../../fotos/escuro/termos.svg";
import perfilIconEscuro from "../../fotos/escuro/login_icon.svg";
import perfilIconClaro from "../../fotos/claro/login_icon_claro.svg";

import configuracoesIconEscuro from "../../fotos/claro/configuracoes_icon_claro.svg";
import configuracoesIconClaro from "../../fotos/escuro/configuracoes_icon.svg";

import { CampoTexto } from '../../Componentes';
import { BotoesForm } from '../../Componentes';
import { Adm } from '../../../funcoes/adm';

//Pego o POPUP
import { PopUp } from "../../Componentes/pop-up";
import Style from "./LayoutADM.module.css"

const LayoutADM = () => {

    const [temaEscuro, setTemaEscuro] = useState(
        localStorage.getItem('TemaSelecionado') === 'Escuro'
    );

    const Links = [
        { label: "Usuários", to: "/usuario" },
        { label: "Conquistas", to: "/conquistas" },
        { label: "Notificações", to: "/*" },
        { label: "Relatórios", to: "/*" },
        { label: "Cosméticos", to: "/*" }
    ];

    const conteudosBarraLateral = [
        { id: 1, descricao: "Relatórios", acao: null, to: "/relatorio" },
        { id: 2, descricao: "Conquistas", acao: 'conquistas' },
        { id: 3, descricao: "Usuarios", acao: null, to: '/usuarios' },
        { id: 4, descricao: "Materias", acao: 'Materias' },
    ];

    const ItemBarraLateral = ({ descricao, img, onClick, to }) => {
        return (
            <Link to={to}>
                <div className={Style.itemBarraLateral} onClick={onClick}>
                    <span>{descricao}</span>
                </div>
            </Link>
        );
    };

    let usuario = JSON.parse(localStorage.getItem("dados"));
    
    //Hamburger
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        const aoAtualizarTema = () => {
            setTemaEscuro(localStorage.getItem('TemaSelecionado') === 'Escuro');
        };

        window.addEventListener('temaAtualizado', aoAtualizarTema);
        return () => window.removeEventListener('temaAtualizado', aoAtualizarTema);
    }, []);

    const [abrirConquistas, setAbrirConquistas] = useState(false);
    const [abrirMaterias, setAbrirMaterias] = useState(false);
    const [aberto, setAberto] = useState(false);

    return (
        <>
            <Cabecalho>
                {/* Menu Hamburger */}
                <BotoesForm
                    className={Style.hamburger}
                    onClick={() => setMenuAberto(!menuAberto)}
                    texto={menuAberto ? "✕" : "☰"}
                />

                <div className={`${Style.links} ${menuAberto ? Style.aberto : ""}`}>

                    <Link to="/perfil">
                        <img src={temaEscuro ? perfilIconEscuro : perfilIconClaro} alt="Perfil" />
                    </Link>

                    {usuario.adm == true ? (
                        <>
                            <Link to="relatorio">
                                <p>ADM</p>
                            </Link>
                        </>
                    ) : (
                        <>
                        </>
                    )}

                    <Link to="/configuracoes">
                        <img src={temaEscuro ? configuracoesIconClaro : configuracoesIconEscuro} alt="configurações" />
                    </Link>


                    <Tema />
                </div>
            </Cabecalho>

            <div className={Style.separarConteudos}>

                <div className={Style.barraLateral}>
                    <h1>Gerenciamento</h1>
                    <hr />

                    <div className={Style.itensBarraLateral}>
                        {conteudosBarraLateral.map((item) => (
                            <div key={item.id}>
                                <ItemBarraLateral
                                    descricao={item.descricao}
                                    to={item.to}
                                    onClick={() => {
                                        if (item.descricao === "Conquistas") {
                                            setAbrirConquistas(!abrirConquistas);
                                        } else if (item.descricao === "Materias") {
                                            setAbrirMaterias(!abrirMaterias);
                                        } else if (item.acao) {
                                            setPopupAtivo(item.acao);
                                        }
                                    }}
                                />


                                {item.descricao === "Conquistas" && abrirConquistas && (<div className={Style.sanfona}>
                                    <Link to="/criar-conquista">
                                        Criar Conquista
                                    </Link>

                                    <Link to="/listar-conquistas">
                                        Lista de Conquistas
                                    </Link>
                                </div>)}

                                {item.descricao === "Materias" && abrirMaterias && (<div className={Style.sanfona}>
                                    <Link to="/criar-materia">
                                        Criar Materia
                                    </Link>

                                    <Link to="/listar-materia">
                                        Listar Materias
                                    </Link>
                                </div>)}
                            </div>
                        ))}
                    </div>
                </div>
                <Outlet />

            </div>

        </>
    )
}

export { LayoutADM }