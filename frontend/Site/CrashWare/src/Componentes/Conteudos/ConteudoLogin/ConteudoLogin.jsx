import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CampoTexto } from "../../CampoTexto"
import { BotoesCadLogin, TIPO_BOTAO } from "../../Botoes";

import esconderSenha_claro from '../../../fotos/claro/nao_pode_ver_senha.svg';
import verSenha_claro from '../../../fotos/claro/pode_ver_senha.svg';
import esconderSenha_escuro from '../../../fotos/escuro/nao_pode_ver_senha_claro.svg';
import verSenha_escuro from '../../../fotos/escuro/pode_ver_senha_claro.svg';

import { Cabecalho } from '../../Cabecalho'
import style from './ConteudoLogin.module.css';

const ConteudoLogin = () =>
{
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');

    useEffect(() => {
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    const isClaro = tema === 'Claro';
    const PodeLogar = email !== "" && senha !== "";

    const iconeSenha = mostrar
        ? (isClaro ? verSenha_claro      : verSenha_escuro)
        : (isClaro ? esconderSenha_claro : esconderSenha_escuro);

    return (
        <>
        <Cabecalho />
        <div className={style.corpo}>
            <div className={style.container}>
                <h1>Login</h1>
                <div>
                    <CampoTexto 
                        type="email" 
                        maxLength={120} 
                        placeholder="Email" 
                        className={style.inputClasse} 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className={style.senhaWrapper}>
                        <CampoTexto 
                            type={mostrar ? "text" : "password"}
                            className={style.inputClasse} 
                            placeholder="Senha" 
                            value={senha} 
                            onChange={(e) => setSenha(e.target.value)} 
                            maxLength={14}
                        />
                        <img 
                            src={iconeSenha}
                            alt="ver senha"
                            className={style.imgSenha}
                            onClick={() => setMostrar(!mostrar)}
                        />
                    </div>
                </div>

                { erro && <p className={style.erro}>{erro}</p> }
                <p className={style.TermosUso}>Ao entrar no <span>CrashWare</span>, você concorda com os nossos termos e politicas de privacidade.</p>
                
                <BotoesCadLogin 
                    texto="Logar" 
                    tipo={TIPO_BOTAO.CADASTRO} 
                    className={style.btnLogar} 
                    disabled={!PodeLogar}
                />

                <div className={style.ou}>
                    <hr />
                    <p>OU</p>
                    <hr />
                </div>

                <Link to='/cadastro'>
                    <BotoesCadLogin 
                        texto="Cadastra-se" 
                        tipo={TIPO_BOTAO.CADASTRO} 
                        className={style.btnLogar} 
                    />
                </Link>
            </div>
        </div>
        </>
    );
};

export { ConteudoLogin };