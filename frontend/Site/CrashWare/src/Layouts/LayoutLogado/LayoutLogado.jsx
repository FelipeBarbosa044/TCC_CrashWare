import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Cabecalho } from "../../Componentes";
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

                <div className={style.linksEscrito}>

                    <div className={style.textos}>

                        <Link to="/perfil">
                            <p>perfil</p>
                        </Link>

                        <Link to="/configuracoes">
                            <p>configurações</p>
                        </Link>

                        <Tema/>

                    </div>

                </div>

                <div className={style.links}>

                    <Link to="/perfil">
                        <img src={temaEscuro ? perfilIconEscuro : perfilIconClaro} alt="perfil" />
                    </Link>

                    <Link to="/configuracoes">
                        <img src={temaEscuro? configuracoesIconClaro : configuracoesIconEscuro} alt="configurações" />
                    </Link>

                    <Tema />
                </div>
            </Cabecalho>
            <Outlet />
        </>
    )
}

export { LayoutLogado }