import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BotoesForm, TIPO_BOTAO } from '../../Botoes';
import { CampoTexto } from '../../CampoTexto';
import { Cabecalho } from '../../Cabecalho';

import esconderSenha_claro from '../../../fotos/claro/nao_pode_ver_senha.svg';
import verSenha_claro from '../../../fotos/claro/pode_ver_senha.svg';
import esconderSenha_escuro from '../../../fotos/escuro/nao_pode_ver_senha_claro.svg';
import verSenha_escuro from '../../../fotos/escuro/pode_ver_senha_claro.svg';

import style from './ConteudoCadastro.module.css';

/*Vocês vão começar a comentar o cod que dia? Vocês não tão fazendo um projeto qualquer não. */

const ConteudoCadstro = () => {

    const [nome, setNome] = useState("")
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

const handleTelefone = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setTelefone(v);
};

//Função que vai validar os dados e enviar para a API:
const handleCadastro = () => {
    //Validações de dados

    
};

    return (
       <> 
        <div className={style.corpo}>
            <div className={style.container}>
                <h1>Cadastre-se</h1>

                <CampoTexto 
                    type="text" 
                    maxLength={100} 
                    placeholder="Nome" 
                    className={style.inputClasse} 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)}
                    autoComplete="new-password"
                />

                <CampoTexto 
                    type="email" 
                    maxLength={200} 
                    placeholder="E-mail" 
                    className={style.inputClasse} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-password"
                />

                <CampoTexto 
                    type="tel" 
                    className={style.inputClasse}
                    placeholder="(00) 00000-0000" 
                    value={telefone} 
                    onChange={handleTelefone}
                />

                <div className={style.senhaWrapper}>
                    <CampoTexto 
                        type={mostrar ? "text" : "password"}
                        className={style.inputClasse} 
                        placeholder="Senha" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                        maxLength={20}
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
                        maxLength={20}
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

                <BotoesForm 
                    texto="Cadastrar" 
                    tipo={TIPO_BOTAO.CADASTRO} 
                    className={style.btnCriarConta} 
                    /*disabled={!PodeMostarBotao}*/
                    
                    //Chamando a função para enviar dados:
                    onClick={handleCadastro}
                />
                
                <div className={style.ou}>
                    <hr />
                    <p>OU</p>
                    <hr />
                </div>

                <Link to='/login'>
                    <BotoesForm 
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