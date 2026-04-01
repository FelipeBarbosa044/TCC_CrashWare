import { useState } from "react";
import { Link } from "react-router-dom";
import { CampoTexto } from "../../CampoTexto"
import { BotoesCadLogin, BotoesForm, TIPO_BOTAO } from "../../Botoes";

import style from './ConteudoLogin.module.css';

const ConteudoLogin = () =>
{
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState('');
    const PodeLogar = email != "" && senha != "";

    return (
        <div className={style.corpo}>

            <Link to="/cadastro">
                <BotoesForm texto='Cadastre-se' tipo={TIPO_BOTAO.CADASTRO} className={style.btncadastro}/>
            </Link>

                <div className={style.container}>

                    <h1>Login</h1>

                        <div>
                            <CampoTexto type="email" maxLength={120} placeholder="Email" className={style.inputClasse} value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <CampoTexto type="password" placeholder="Senha" className={style.inputClasse} value={senha} onChange={(e) => setSenha(e.target.value)} maxLength={12}/>
                        </div>

                        { erro && <p className={style.erro}>{erro}</p> }
                        <p className = {style.TermosUso}>Ao entrar no <span>CrashWare</span>, você concorda com os nossos termos e politicas de privacidade.</p>
                        
                        <BotoesCadLogin texto="Logar" tipo={TIPO_BOTAO.CADASTRO} className={style.btnLogar} disabled={!PodeLogar}/>

                </div>

        </div>
    );
};

export { ConteudoLogin };