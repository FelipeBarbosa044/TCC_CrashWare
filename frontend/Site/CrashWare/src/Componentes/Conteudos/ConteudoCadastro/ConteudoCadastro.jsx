import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BotoesCadLogin, TIPO_BOTAO } from '../../Botoes';
import { CampoTexto } from '../../CampoTexto';
import { Cabecalho } from '../../Cabecalho';

import esconderSenha_claro from '../../../fotos/claro/nao_pode_ver_senha.svg';
import verSenha_claro from '../../../fotos/claro/pode_ver_senha.svg';
import esconderSenha_escuro from '../../../fotos/escuro/nao_pode_ver_senha_claro.svg';
import verSenha_escuro from '../../../fotos/escuro/pode_ver_senha_claro.svg';

import style from './ConteudoCadastro.module.css';

const ConteudoCadstro = () => {

    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrar, setMostrar] = useState(false); 
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');

    useEffect(() => {
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    const isClaro = tema === 'Claro';
    const PodeMostarBotao = senha !== "" && senha === confirmarSenha;

    const iconeSenha = mostrar
        ? (isClaro ? verSenha_claro      : verSenha_escuro)
        : (isClaro ? esconderSenha_claro : esconderSenha_escuro);

    const iconeConfirmarSenha = mostrarConfirmar
        ? (isClaro ? verSenha_claro      : verSenha_escuro)
        : (isClaro ? esconderSenha_claro : esconderSenha_escuro);

    return (
       <> 
    <Cabecalho />
        <div className={style.corpo}>
            <div className={style.container}>
                <h1>Cadastre-se</h1>

                <CampoTexto 
                    type="email" 
                    maxLength={120} 
                    placeholder="E-mail" 
                    className={style.inputClasse} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-password"
                />

                <CampoTexto 
                    type="number" 
                    className={style.inputClasse}
                    placeholder="N° de Telefone" 
                    value={telefone} 
                    onChange={(e) => setTelefone(e.target.value)} 
                    maxLength={11}
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

                <div className={style.senhaWrapper}>
                    <CampoTexto 
                        type={mostrarConfirmar ? "text" : "password"}
                        className={style.inputClasse} 
                        placeholder="Confirme sua Senha" 
                        value={confirmarSenha} 
                        onChange={(e) => setConfirmarSenha(e.target.value)} 
                        maxLength={14}
                    />
                    <img 
                        src={iconeConfirmarSenha}
                        alt="ver confirmar senha"
                        className={style.imgSenha}
                        onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    />
                </div>

                <p className={style.TermosUso}>
                    Ao entrar no <span>CrashWare</span>, você concorda com os nossos termos e politicas de privacidade.
                </p>

                <BotoesCadLogin 
                    texto="Cadastrar" 
                    tipo={TIPO_BOTAO.CADASTRO} 
                    className={style.btnCriarConta} 
                    disabled={!PodeMostarBotao}
                />
                
                <div className={style.ou}>
                    <hr />
                    <p>OU</p>
                    <hr />
                </div>

                <Link to='/Login'>
                    <BotoesCadLogin 
                        texto="Entrar" 
                        tipo={TIPO_BOTAO.CADASTRO} 
                        className={style.btnCriarConta} 
                    />
                </Link>
            </div>
        </div>
        </>
    );
};

export { ConteudoCadstro };