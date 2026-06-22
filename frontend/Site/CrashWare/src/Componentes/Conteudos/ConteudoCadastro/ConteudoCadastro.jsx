import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { BotoesForm, TIPO_BOTAO } from '../../Botoes';
import { CampoTexto } from '../../CampoTexto';
import { PopUp } from '../../pop-up';
import { SiGithub, SiGoogle } from 'react-icons/si'


//Logar com google
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";



import verSenha_claro from '../../../fotos/claro/pode_ver_senha.svg';
import esconderSenha_claro from '../../../fotos/claro/nao_pode_ver_senha.svg';

import style from './ConteudoCadastro.module.css';

//Importando sleep
import { sleep } from "../../../../funcoes/functions"

//Importando classe api
import { Api } from "../../../../funcoes/functions"

const ConteudoCadstro = () => {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmaSenha] = useState();
    const [mostrar, setMostrar] = useState(false);
    const [mostrarConfimar, setMostrarConfimar] = useState(false);
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');
    const [popup, setPopup] = useState(null);

    //Levará para a verificacao de email
    const Navegacao = useNavigate();

    //Objeto da classe Api
    const api = new Api();

    const EntrarGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {

                const resposta = await fetch(
                    "https://www.googleapis.com/oauth2/v3/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${tokenResponse.access_token}`
                        }
                    }
                );

                const usuario = await resposta.json();

                api.cadastrarGoogle(usuario.name,usuario.email,usuario.picture,usuario.sub,setPopup,Navegacao)

            } catch (erro) {
                console.error("Erro ao obter dados do Google:", erro);
            }
        },

        onError: () => {
            console.log("Erro ao cadastrar com Google");
        }
    });


    function EntrarGitHub() {
         window.location.href ="https://api-crashware.onrender.com/auth/github";
    }


    useEffect(() => {


        //Tema claro e escuro (não faço ideia oq faz pq ninguem comenta) isso muda o tema, ué
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);


        //
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    const inputRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }, []);

    const handleCadastro = async () => {
        
        //Chamo o método
        api.cadastrar(nome, email, senha, confirmarSenha, setPopup, Navegacao);
    }

    const iconeSenha = mostrar
        ? (verSenha_claro)
        : (esconderSenha_claro);

    const iconeConfirmaSenha = mostrarConfimar
        ? (verSenha_claro)
        : (esconderSenha_claro);

    const Cadastrar = () => {
        handleCadastro()
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.repeat) {
                            Cadastrar();
                        }
                    }}
                >

                    <h1>Cadastre-se</h1>

                    <p>Nome</p>
                    <CampoTexto
                        type="text"
                        maxLength={100}
                        ref={inputRef}
                        placeholder="Nome*"
                        className={style.inputClasse}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        autoComplete='name'
                    />

                    <p>Email</p>
                    <CampoTexto
                        type="email"
                        maxLength={200}
                        placeholder="E-mail*"
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
                            placeholder="Senha*"
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

                    <p>Confirme a Senha</p>
                    <div className={style.senhaWrapper}>
                        <CampoTexto
                            type={mostrarConfimar ? "text" : "password"}
                            className={style.inputClasse}
                            placeholder="Confirme sua Senha*"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmaSenha(e.target.value)}
                            maxLength={30}
                        />
                        <img
                            src={iconeConfirmaSenha}
                            alt="ver senha"
                            className={style.imgSenha}
                            onClick={() => setMostrarConfimar(!mostrarConfimar)}
                        />
                    </div>

                    <BotoesForm
                        texto="Cadastrar"
                        tipo={TIPO_BOTAO.CADASTRO}
                        className={style.btnCriarConta}
                        onClick={handleCadastro}
                    />

                    <div className={style.termos}>
                        <p>Ao criar uma conta, você concorda com nossos</p>
                        <Link to="/termos">
                            <span>
                                Termos de Uso
                            </span>
                        </Link>
                    </div>

                </div>

                <p className={style.Logar}>
                    Já tem uma conta? <Link to="/login">Entre</Link>
                </p>

                <div className={style.outrasFormasCadastro}>
                    <a onClick={EntrarGoogle}>
                        <SiGoogle size={32} style={{ color: '#4285F4' }}/>
                    </a>
                    <a onClick={EntrarGitHub}>
                        <SiGithub size={32} style={{ color: '#000000' }}/>
                    </a>
                </div>

                
            </div>
        </>
    );
};

export { ConteudoCadstro };