import { useState, useEffect, useRef } from "react";
import { Link, useBlocker, useLocation, useNavigate } from "react-router-dom";
import { CampoTexto } from "../../CampoTexto";
import { BotoesForm } from "../../Botoes";
import style from './CVerificacaoEmail.module.css'
import { PopUp } from '../../pop-up';

//Importando sleep
import { Api, sleep } from "../../../../funcoes/functions"

const CVerificacaoEmail = () => {

    //Instancionando a API para receber dados do usuário
    const usuario = JSON.parse(localStorage.getItem("dados"));



    //useState/variaveis
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [verificando, setVerificando] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [enviarcodigo, setEnviarCodigo] = useState(false);
    const [erro, setErro] = useState("");
    const setPodeNavegar = useRef(false);
    const [mostrarModal, setMostrarModal] = useState(false);

    //Variavel da popup
    const [popup, setPopup] = useState(null);

    //Navegação e recebimento de dados
    const location = useLocation();
    const Navegacao = useNavigate();

    //Recebe Os dados
    const mensagem = location.state?.mensagem;
    const email = location.state?.email;
    const email_novo = location.state?.email_novo;
    const nome = location.state?.nome;
    const origem = location.state?.origem;


    //Nome maiusculo
    const nomeM = nome?.toUpperCase() || "";


    //setDados
     const [dados, setDados] = useState(() =>
        JSON.parse(localStorage.getItem("dados")) || null
    );


    //Block de navegação

    useEffect(() => {
        if (!location.state?.email) {
            Navegacao(origem || "/login");
        }
    }, []);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!setPodeNavegar.current) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    useEffect(() => {
        if (setPodeNavegar.current) return;

        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
            setMostrarModal(true);
        };

        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => window.removeEventListener("popstate", handlePopState);
    }, [])

    //Temporizador
    useEffect(() => {
        if (timer === 0) return;

        const intervalo = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(intervalo);
    }, [timer]);

    //Função de reenviar o código
    const ReenviarCodigo = async () => {
        //Instâncio o objeto 
        const usuario = new Api();

        //Chamo o método
        usuario.Enviar_Codigo(email, setPopup, loading, timer, setLoading, setTimer, setEnviarCodigo,email_novo);

    }

    const handleVericarEmail = async () => {
        const usuario = new Api();
        usuario.Verificar_Codigo(email, codigo, setPopup, setPodeNavegar, Navegacao,setDados,email_novo)
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

            {mostrarModal && (
                <div className={style.modalOverlay}>
                    <div className={style.modal}>
                        <h4>Tem certeza que deseja sair? O processo pode ser perdido.</h4>
                        <BotoesForm
                            onClick={() => {
                                setMostrarModal(false);
                                setPodeNavegar.current = true;
                                Navegacao(origem || "/recuperar-senha")
                            }}
                            className={style.btnSair}
                            texto="Sair"
                        />
                        <BotoesForm onClick={() => {
                            setMostrarModal(false);
                            // blocker.reset(); 
                        }}
                            className={style.btnFicar}
                            texto="Ficar"
                        />
                    </div>
                </div>
            )}

            <div className={style.corpo}>
                <div className={style.container}>
                    <h1>Bem-Vindo {nomeM}!!!</h1>
                    <p className={style.texto}>Verifique o Código enviado para o email: <span>{email_novo || email}</span></p>

                    <CampoTexto type="text" placeholder="Insira o Código"
                        className={style.inputClasse}
                        // ref={inputRef}   
                        value={codigo}
                        maxLength={6}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setCodigo(valor); //Só aceita números.
                        }}
                    />

                    {erro && <p className={style.erro}>{erro}</p>}


                    {/* <Link  to=""> */}
                    {/* <BotoesForm texto="Verificar" className={style.btnEnviar}
                        onClick={handleVericarEmail}
                    //disabled={!PodeMostarBotao}
                    /> */}
                    {/* </Link> */}

                    <BotoesForm
                        texto={loading ? "Espere..." : timer > 0 ? `Reenviar em ${timer}s` : "Enviar Código"} className={style.btnEnviar}
                        onClick={ReenviarCodigo}
                        disabled={timer > 0 || loading}
                    />

                    <BotoesForm
                        texto="Verificar"
                        className={style.btnEnviar}
                        onClick={handleVericarEmail}
                        disabled={!enviarcodigo || loading}
                    />
                </div>
            </div >
        </>
    )
}

//exportação da função
export { CVerificacaoEmail }