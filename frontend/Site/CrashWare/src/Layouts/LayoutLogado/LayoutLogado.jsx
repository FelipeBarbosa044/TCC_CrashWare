import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { BotoesForm, Cabecalho } from "../../Componentes";
import style from "./LayoutLogado.module.css";
import { Link } from "react-router-dom";
import { Tema } from "../../Componentes";

import perfilIconEscuro from "../../fotos/escuro/login_icon.svg";
import perfilIconClaro from "../../fotos/claro/login_icon_claro.svg";

import configuracoesIconEscuro from "../../fotos/claro/configuracoes_icon_claro.svg";
import configuracoesIconClaro from "../../fotos/escuro/configuracoes_icon.svg";

const LayoutLogado = () => {
    const [temaEscuro, setTemaEscuro] = useState(
        localStorage.getItem('TemaSelecionado') === 'Escuro'
    );

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

    return (
        <>
            <Cabecalho>
                {/* Menu Hamburger */}
                <BotoesForm
                    className={style.hamburger}
                    onClick={() => setMenuAberto(!menuAberto)}
                    texto={menuAberto ?  "✕" : "☰"}
                />

                <div className={`${style.links} ${menuAberto ? style.aberto : ""}`}>

                    <Link onClick={() => {
                        window.location.href = "/perfil";
                    }}>
                        <img src={temaEscuro ? perfilIconEscuro : perfilIconClaro} alt="perfil" />
                    </Link>

                    {usuario?.adm == true ? (
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
            <Outlet />
        </>
    )
}

export { LayoutLogado }