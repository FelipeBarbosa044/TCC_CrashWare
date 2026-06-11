import { useState, useEffect } from "react";
import Style from "./PopUp.module.css";

import iconeErroClaro from "../../fotos/erroPopUpClaro.svg";
import iconeErroEscuro from "../../fotos/erroPopUpEscuro.svg";

import iconeAvisoClaro from "../../fotos/avisoPopUpClaro.svg";
import iconeAvisoEscuro from "../../fotos/avisoPopUpEscuro.svg";

import iconeSucessoClaro from "../../fotos/correta.svg";
import iconeSucessoEscuro from "../../fotos/correta_preta.svg";

const PopUp = ({
    tipo = "erro",
    titulo,
    mensagem,
    onFechar,
    duracao = 4000,
}) => {

    const [temaEscuro, setTemaEscuro] = useState(
        localStorage.getItem("TemaSelecionado") === "Escuro"
    );

    useEffect(() => {
        const atualizarTema = () => {
            setTemaEscuro(
                localStorage.getItem("TemaSelecionado") === "Escuro"
            );
        };

        window.addEventListener("temaAtualizado", atualizarTema);

        return () => {
            window.removeEventListener(
                "temaAtualizado",
                atualizarTema
            );
        };
    }, []);

    useEffect(() => {
        if (!duracao || !onFechar) return;

        const timer = setTimeout(() => {
            onFechar();
        }, duracao);

        return () => clearTimeout(timer);
    }, [duracao, onFechar]);

    const icones = {
        erro: temaEscuro
            ? iconeErroEscuro
            : iconeErroClaro,

        aviso: temaEscuro
            ? iconeAvisoEscuro
            : iconeAvisoClaro,

        sucesso: temaEscuro
            ? iconeSucessoClaro
            : iconeSucessoEscuro,
    };

    return (
        <div className={Style.popupOverlay}>
            <div
                className={`${Style.popup} ${
                    Style[
                        `popup${
                            tipo.charAt(0).toUpperCase() +
                            tipo.slice(1)
                        }`
                    ]
                }`}
            >
                <div className={Style.popupIcone}>
                    <img
                        src={icones[tipo]}
                        alt={tipo}
                    />
                </div>

                <div className={Style.popupBody}>
                    <p className={Style.popupTitulo}>
                        {titulo}
                    </p>

                    {mensagem && (
                        <p className={Style.popupMensagem}>
                            {mensagem}
                        </p>
                    )}
                </div>

                {onFechar && (
                    <button
                        className={Style.popupFechar}
                        onClick={onFechar}
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
};

export { PopUp };