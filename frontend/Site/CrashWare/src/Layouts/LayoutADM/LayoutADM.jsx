import { Sidebar } from '../../Componentes/Cabecalho/barraLateral/sideBar';
import { Outlet, Link } from "react-router-dom"
import { useState } from "react"
import { Cabecalho } from "../../Componentes"

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
import { CampoTexto } from '../../Componentes';
import { BotoesForm } from '../../Componentes';
import { Adm } from '../../../funcoes/adm';

//Pego o POPUP
import { PopUp } from "../../Componentes/pop-up";
import Style from "./LayoutADM.module.css"

const LayoutADM = () => {
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

    const [abrirConquistas, setAbrirConquistas] = useState(false);
    const [abrirMaterias, setAbrirMaterias] = useState(false);
    const [aberto, setAberto] = useState(false);

    return (
        <>
            <Cabecalho>
                <button className={Style.hamburger} onClick={() => setAberto(!aberto)}>
                    {aberto ? <p>✕</p> : <p>☰</p>}
                </button>
                <Sidebar aberto={aberto} onFechar={() => setAberto(false)} />
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
                                        }else if(item.descricao === "Materias"){
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

                                    <Link to="/listar-materias">
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