import { SairDaConta } from "../../../funcoes/functions";
import Style from "./PopUpBanido.module.css";
// PopUpBanido.jsx
import { useState } from "react";



const PopUpBanido = ({ onFechar }) => {
        const [token_state, setToken] = useState(() => localStorage.getItem("token"));
        const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
        const [dados, setDados] = useState(() =>
            JSON.parse(localStorage.getItem("dados")) || null
        );

        //Pega os dados do usuario
        const usuario = JSON.parse(localStorage.getItem("dados"));

        const motivo = usuario?.motivo_banimento
         ? `Motivo do banimento: ${usuario.motivo_banimento}`
        : "";

    
    return (
        <>
            <div className={Style.fundoEscurecido} />

            <div className={Style.popUp}>
                <div className={Style.icone}>
                    {/* tenque colocar a imagem eu vejo amanha */}
                </div>
                <h1>Conta Banida/Desativada</h1>
                <p>
                    Sua conta está banida ou desativada.
                    Caso queira solicitar a recuperação da conta, entre em contato com o suporte: plataformacrashware@gmail.com   
                </p>

                {motivo && (
                    <p className={Style.motivoBanimento}>
                        {motivo}
                    </p>
                )}
                
                <div className={Style.botoes}>
                    <button className={Style.primeiroBotao} onClick={() => SairDaConta(setToken, setRefresh, setDados)}>
                        Entendi
                    </button>
                </div>
            </div>
        </>
    );
};

export { PopUpBanido };