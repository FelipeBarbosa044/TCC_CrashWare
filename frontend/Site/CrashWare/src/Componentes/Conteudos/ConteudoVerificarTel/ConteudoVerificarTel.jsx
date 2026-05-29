import style from './ConteudoVerificarTel.module.css'

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PopUp } from '../../pop-up';
import { CampoTexto } from '../../CampoTexto';
import { BotoesForm } from '../../Botoes/';
import { Api } from '../../../../funcoes/functions';
import { Configurações } from '../../../../funcoes/configurações';

const ConteudoVerificarTel = () => {

    //Instancia objeto que contém dados do usuário
    const usuario = JSON.parse(localStorage.getItem("dados"));


    //useState/variaveis
    const [codigo, setCodigo] = useState('');
    const [mostrarModal, setMostrarModal] = useState(false);
    const [enviarcodigo, setEnviarCodigo] = useState(false);
    const [timer, setTimer] = useState(0);
    const [loading, setLoading] = useState(false);
    const [verificando, setVerificando] = useState(false);
    const [erro, setErro] = useState("");

    const setPodeNavegar = useState(false);
    const tema = localStorage.getItem('tema') || 'claro';

    //Pego os tokens
    const token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refresh_token");

    //variavel da popup
    const [popup, setPopup] = useState(null);

    //UseState de dados do usuario
    const [token_state, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
    const [dados, setDados] = useState(() =>
        JSON.parse(localStorage.getItem("dados")) || null
    );

    //Lista que contém todos os usestate
    const set = [setToken, setRefresh, setDados];

    //Navegação
    const Navegacao = useNavigate();
    const location = useLocation();
    const origem = location.state?.origem;
    const telefone = location.state?.telefone || "";
    const email = location.state?.email;


    //Instancia objeto da classe Configurações
    const api = new Configurações(token,refresh_token,Navegacao,set);


    const telefoneF = telefone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"); //Formata o telefone para exibição

    //Block de navegação

    useEffect(() => {
        if (!location.state?.telefone) {
            Navegacao(origem || "/configuracoes");
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
        }, 10000);

        return () => clearInterval(intervalo);
    }, [timer]);

    const EnviarSMS = async () =>
        {
             setPopup({
                    tipo: 'aviso',
                    titulo: 'SMS',
                    mensagem: 'Enviando SMS...'
                });
                
            //Chamo o método de Enviar SMS
            await api.Enviar_SMS(telefone,email,setPopup, loading, timer, setLoading, setTimer,setEnviarCodigo)
            
        }

    const VerificarSMS = async () =>
        {
             setPopup({
                    tipo: 'aviso',
                    titulo: 'SMS',
                    mensagem: 'Verificando SMS...'
                });
                
            //Chamo o método de Verificar SMS
            await api.Verificar_SMS(telefone,email,codigo,setPopup,Navegacao,setDados)
            
        }

    return (

        <div>
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
                    <h1>Confirmar Telefone</h1>

                    <h2>Digite o código de verificação que enviamos no seu <span>SMS</span></h2>

                    <h3><span>{telefoneF}</span></h3>
                    <div className={style.senhaWrapper}>
                        <CampoTexto
                            type="text"
                            className={style.inputClasse}
                            placeholder="Código de verificação*"
                            value={codigo}
                            onChange={(e) => {
                                const valor = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setCodigo(valor); //Só aceita números.
                            }}
                        />
                    </div>

                    <BotoesForm
                        texto={loading ? "Espere..." : timer > 0 ? `Reenviar em ${timer}s` : "Enviar SMS"} className={style.btnEnviar}
                         onClick={EnviarSMS}
                        disabled={timer > 0 || loading}
                    />

                    <BotoesForm
                        texto="Verificar"
                        className={style.btnEnviar}
                         onClick={VerificarSMS}
                        // disabled={!enviarcodigo || loading}
                    />
                </div>
            </div>
        </div>
    )
}

export { ConteudoVerificarTel }