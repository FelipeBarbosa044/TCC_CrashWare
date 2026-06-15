import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CampoTexto } from "../../CampoTexto";
import { BotoesForm, TIPO_BOTAO } from "../../Botoes";
import { SiGithub, SiGoogle } from 'react-icons/si'

//popup
import { PopUp } from "../../pop-up";

import esconderSenha_claro from '../../../fotos/claro/nao_pode_ver_senha.svg';
import verSenha_claro from '../../../fotos/claro/pode_ver_senha.svg';
import esconderSenha_escuro from '../../../fotos/escuro/nao_pode_ver_senha_claro.svg';
import verSenha_escuro from '../../../fotos/escuro/pode_ver_senha_claro.svg';


import style from './ConteudoLogin.module.css';
import { Api, sleep } from "../../../../funcoes/functions";



const ConteudoLogin = () => {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrar, setMostrar] = useState(false);
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');
    const [popup, setPopup] = useState(null);
   

    useEffect(() => {
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    //Para o cursor piscar
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    //Levará para verificar email caso nao for verificado
    const Navegacao = useNavigate();

    const isClaro = tema === 'Claro';

    const iconeSenha = mostrar
        ? (verSenha_claro)
        : (esconderSenha_claro );


    const handleLogin = async () => {
        
        const usuario = new Api();

        //Chamo o método
        usuario.Logar(email, senha, setPopup, Navegacao);

    };

    const Logar = () =>{
        handleLogin()
    }

    return (
        <>
            {popup && (
                <PopUp
                    tipo={popup.tipo}
                    titulo={popup.titulo}
                    mensagem={popup.mensagem}
                    onFechar={() => setPopup(null)}
                />
            )}

            <div className={`${style.corpo} ${tema}`}>
                <div className={style.container}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter" && !e.repeat){
                            Logar();
                        }
                    }}
                >

                    <h1>Entrar</h1>

                    <p>E-mail</p>
                    <CampoTexto
                        type="email"
                        ref={inputRef}
                        maxLength={200}
                        placeholder="seu@gmail.com"
                        className={style.inputClasse}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete='email'
                    />

                    <p>Senha</p>
                    <div className={style.senhaWrapper}>
                        <CampoTexto
                            type={mostrar ? "text" : "password"}
                            className={style.inputClasse}
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            maxLength={30}
                        />
                        <img
                            src={iconeSenha}
                            alt="ver senha"
                            className={style.imgSenha}
                            onClick={() => setMostrar(!mostrar)}
                        />
                    </div>

                    {/* Link para rec senha */}
                    <div className={style.Esqueceu}>
                        {/* Link para proteção URL */}

                        <Link to="/recuperar-senha"
                            state={{ origem: "/login" }}
                        >
                            <p>Esqueceu a senha?</p>
                        </Link>
                    </div>

                    <BotoesForm
                        texto="Entrar"
                        tipo={TIPO_BOTAO.CADASTRO}
                        className={style.btnLogar}
                        onClick={handleLogin}
                    />

                </div>
                
                <p className={style.Cadastrar}>
                    Não tem uma Conta? 
                    <Link to="/cadastro">Cadastre-se</Link>
                </p>

                <div className={style.outrasFormasLogin}>
                    <a href="#">
                        <SiGoogle size={32} style={{ color: '#4285F4' }}/>
                    </a>
                    <a href="#">
                        <SiGithub size={32} style={{ color: '#000000' }}/>
                    </a>
                </div>
            </div>
        </>
    );
};

export { ConteudoLogin };