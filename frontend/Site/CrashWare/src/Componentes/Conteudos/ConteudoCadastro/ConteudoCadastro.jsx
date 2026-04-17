import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { BotoesForm, TIPO_BOTAO } from '../../Botoes';
import { CampoTexto } from '../../CampoTexto';
import { PopUp } from '../../pop-up';

import esconderSenha_claro from '../../../fotos/claro/nao_pode_ver_senha.svg';
import verSenha_claro from '../../../fotos/claro/pode_ver_senha.svg';
import esconderSenha_escuro from '../../../fotos/escuro/nao_pode_ver_senha_claro.svg';
import verSenha_escuro from '../../../fotos/escuro/pode_ver_senha_claro.svg';

import style from './ConteudoCadastro.module.css';

const ConteudoCadstro = () => {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrar, setMostrar] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');
    const [popup, setPopup] = useState(null);

    

    //Levará para a verificacao de email
    const Navegacao = useNavigate();

    useEffect(() => {
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus(); // coloca o cursor no input
    }, []);
    

    const isClaro = tema === 'Claro';

    const iconeSenha = mostrar
        ? (isClaro ? verSenha_claro : verSenha_escuro)
        : (isClaro ? esconderSenha_claro : esconderSenha_escuro);

    const iconeConfirmarSenha = mostrarConfirmar
        ? (isClaro ? verSenha_claro : verSenha_escuro)
        : (isClaro ? esconderSenha_claro : esconderSenha_escuro);

    //  VALIDAÇÃO DIRETA (retorna só 1 erro)
    const validarCampos = () => {

        if (!nome.trim()) {
            return "Preencha o nome";
        }

        if (/\d/.test(nome)) {
            return "Nome inválido";
        }

        if (nome.length < 5) {
            return "Nome deve ter pelo menos 5 caracteres";
        }

        if (!email.trim()) {
            return "Preencha o e-mail";
        }

        if (!email.includes("@") || !email.includes(".")) {
            return "E-mail inválido";
        }

        if (senha.length < 8) {
            return "Senha deve ter pelo menos 8 caracteres";
        }

        if (senha.includes(" ")) {
            return "Senha não pode conter espaços";
        }

        if (senha !== confirmarSenha) {
            return "As senhas não coincidem";
        }

        return null;
    };

    const handleCadastro = async () => {

        const erro = validarCampos();

        if (erro) {
            setPopup({
                tipo: 'aviso',
                titulo: 'Erro no formulário',
                mensagem: erro
            });
            return;
        }

        try {
            const response = await fetch("https://api-crashware.onrender.com/auth/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome_usuario: nome.trim(),
                    email: email.replace(/\s/g, "").toLowerCase(),
                    senha: senha
                })
            });

            if (!response.ok) {
                const erro = await response.json();

                

                setPopup({
                    tipo: 'erro',
                    titulo: 'Erro no cadastro',
                    mensagem: erro.detail
                });

                return;
            }

            const dados = await response.json();

            Navegacao("/verificacao-email", {
                state: {
                    mensagem: dados.mensagem,
                    nome: nome.toUpperCase(),
                    email: email.replace(/\s/g, "").toLowerCase()
                }
            });

        } catch (error) {
            console.log("Erro:", error);

            setPopup({
                tipo: 'erro',
                titulo: 'Sem conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });
        }
    };

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
                <div className={style.container}>

                    <h1>Cadastre-se</h1>

                    <CampoTexto
                        type="text"
                        maxLength={100}
                        ref={inputRef}
                        placeholder="Nome*"
                        className={style.inputClasse}
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        autoComplete = 'name'
                    />

                    <CampoTexto
                        type="email"
                        maxLength={200}
                        placeholder="E-mail*"
                        className={style.inputClasse}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete = 'email'
                    />

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

                    <div className={style.senhaWrapper}>
                        <CampoTexto
                            type={mostrarConfirmar ? "text" : "password"}
                            className={style.inputClasse}
                            placeholder="Confirme sua Senha*"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            maxLength={30}
                        />
                        <img
                            src={iconeConfirmarSenha}
                            alt="ver senha"
                            className={style.imgSenha}
                            onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                        />
                    </div>

                    <p className={style.TermosUso}>
                        Ao entrar no <span>CrashWare</span>, você concorda com os termos e políticas.
                    </p>

                    <BotoesForm
                        texto="Cadastrar"
                        tipo={TIPO_BOTAO.CADASTRO}
                        className={style.btnCriarConta}
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