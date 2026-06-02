import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Usuario } from "../../../../funcoes/user";
import style from "./ConteudoHome.module.css";


import hardwareIcon from "../../../fotos/hardware.svg";
import softwareIcon from "../../../fotos/software.svg";
import raposaIcon from "../../../fotos/Raposa.svg";

import { PopUp } from '../../pop-up';
import { PopUpConquista } from "../../popUpConquistas";
import { PopUpBanido } from "../../popUpBanido/PopUpBanido";

// felipe depois tenque substituir pelos dados da API
const anotacaoItens = [
    { id: 1, titulo: "Metas para os estudos", data: "01/04/2026" },
    { id: 2, titulo: "Introdução ao Hardware", data: "10/04/2026" },
    { id: 3, titulo: "Introdução ao Software", data: "20/04/2026" },
];

const ConteudoHome = () => {

    //Popup
    const [popup, setPopup] = useState(null);

    //PopupConquista
    const [popupConquista, setPopupConquista] = useState(null);

    //PopupBanido/Desativado
    const [banido, setBanido] = useState(false);

    //SetMaiorOfensiva
    const [maiorOfensiva, setMaiorOfensiva] = useState(
        localStorage.getItem("maior_ofensiva") || 0
    );

    //Pego os tokens
    const token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refresh_token");

    //Navegação --> Permite eu levar o usuario para outras telas
    const Navegacao = useNavigate();

    //Pego os states
    const [token_state, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
    const [dados, setDados] = useState(() =>
        JSON.parse(localStorage.getItem("dados")) || null
    );

    //Lista que contém todos os usestate
    const set = [setToken, setRefresh, setDados];

    const informacoes = localStorage.getItem("info")

    //Pego todas as informações do usuario
    if (informacoes == "false") {

        CarregarInformacoes();

    }

    async function VerificarOfensiva() {
        const user = new Usuario(token, refresh_token, Navegacao, set);
        await user.ValidarOfensiva(setMaiorOfensiva, setDados);
        usuario = JSON.parse(localStorage.getItem("dados"));

    }

    async function CarregarInformacoes() {

        //Crio o bjeto que contem requisições para o banco
        const user = new Usuario(token, refresh_token, Navegacao, set);

        //Sicronizo ofensiva do banco de dados
        await user.SicronizarOfensiva(setPopup)

        //Valido a ofensiva
        await VerificarOfensiva();

        //Conquista ao logar
        await user.conquista(9, setPopupConquista, setDados)

        //Pego as informações do usuario
        await user.perfil(setDados);
    }


    //Pega os dados do usuario
    let usuario = JSON.parse(localStorage.getItem("dados"));


    useEffect(() => {
        //Verifico se usuario esta banido/desativado
        if (usuario?.ativo === false) {
            setBanido(true);
        }
    }, [usuario?.ativo]);

    // const XpMax = 500;
    let xp = usuario?.xp ?? 0;
    const xpAtual = xp % 500;
    const porcentagem = (xpAtual / 500) * 100;
    const nome = usuario?.nome ?? "Usuário";

    //Calcula o nível
    const Nivel = Math.min(Math.floor(xp / 500) + 1, 15);



    const ofensiva = usuario?.ofensiva ?? 0;

    useEffect(() => {
        // //Atualiza os dados do usuario, sempre que a pagina for acessada
        // const onVisible = () => {
        //     if (!document.hidden) {
        //         const cliente = new Usuario();
        //         cliente.perfil(setDados);
        //     }
        // };
        // document.addEventListener("visibilitychange", onVisible);


        //Valido a ofensiva
        VerificarOfensiva();

    }, []);



    const ultimaAula = {
        trilha: "Hardware",
        numero: "Aula 2",
        titulo: "Como vai funcionar esse curso?",
        proximoModulo: "Introdução ao Hardware",
    };

    if (!usuario && !xpAtual && !ofensiva) {
        return (
            <div className={style.Carregamento}>
                <h3>
                    CARREGANDO...
                </h3>
                <p>
                    Estamos preparando tudo para você. Aguarde um momento.
                </p>
                <div className={style.giradorLegal} />
            </div>
        );
    }


    // useEffect(() => {
    //     if (xp > XpMax) {
    //         Nivel += 1;
    //     }
    // }, [Nivel])
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
            {popupConquista && (
                <PopUpConquista
                    tipo={popupConquista.tipo}
                    titulo={popupConquista.titulo}
                    mensagem={popupConquista.mensagem}
                    onFechar={() => setPopupConquista(null)}
                />
            )}

            {banido &&
                <PopUpBanido
                    onFechar={() => setBanido(false)}
                />}


            <div className={style.corpo}>
                <div className={style.header}>

                    <div className={style.headerUsuario}>
                        <img
                            className={style.foto}
                            src={`https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/${usuario?.foto}`}
                            alt="Foto de perfil"
                            onClick={() => {
                                Navegacao('/perfil')
                            }

                            }
                        />

                        <div className={style.headerTexto}>
                            <p className={style.bemVindo}>BEM-VINDO DE VOLTA,</p>
                            <h2 className={style.nomeUsuario}>{nome}</h2>

                            <div className={style.Nivel}>
                                <div className={style.NivelTopo}>
                                    <span>Nível {Nivel}</span>
                                    <span>{xpAtual} XP</span>
                                </div>
                                <div className={style.Barra}>
                                    <div
                                        className={style.Progresso}
                                        style={{ width: `${porcentagem}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={style.ofensiva}>

                        <div className={style.raposa}>
                            <img src={raposaIcon} alt="" />
                        </div>

                        <div className={style.infoOfensiva}>
                            <span className={style.ofensivaDias}>{ofensiva} Dias</span>
                            <p className={style.ofensivaLabel}>Consecutivos<br />de ofensiva</p>
                        </div>

                    </div>

                </div>


                <div className={style.grade}>

                    <div className={style.aulaAtual}>
                        <p className={style.aulaTag}>{ultimaAula.trilha} | {ultimaAula.numero}</p>
                        <h3 className={style.aulaTitulo}>{ultimaAula.titulo}</h3>

                        <Link to="/comoFunciona">
                            <button className={style.btnRetomar}>Retomar</button>
                        </Link>

                        <div className={style.proximoModulo}>
                            <span className={style.proximoLabel}>Próximo Módulo</span>
                            <div className={style.proximoItem}>
                                <div className={style.proximoDot} />
                                <p>{ultimaAula.proximoModulo}</p>
                            </div>
                        </div>
                    </div>

                    <div className={style.anotacoes}>
                        <h4 className={style.secaoTitulo}>ÚLTIMAS ANOTAÇÕES</h4>

                        <div className={style.listaAnotacoes}>
                            {anotacaoItens.map((a) => (
                                <div key={a.id} className={style.itemAnotacao}>
                                    <p className={style.anotacaoTitulo}>{a.titulo}</p>
                                    <span className={style.anotacaoData}>{a.data}</span>
                                </div>
                            ))}
                        </div>

                        <Link to="/anotacoes">
                            <button className={style.verTodas}>Ver todas as anotações</button>
                        </Link>
                    </div>

                </div>

                <div className={style.trilhasContainer}>
                    <h4 className={style.secaoTitulo}>TRILHAS</h4>

                    <div className={style.trilhas}>

                        <div className={style.trilhaHardware}>

                            <img src={hardwareIcon} alt="Hardware" />
                            <div>
                                <h3>Hardware</h3>
                                <p>Desvende a arquitetura das máquinas de forma acessível</p>
                            </div>

                            <Link to="/hardware">
                                <button className={style.btnExplorar}>EXPLORAR &gt;</button>
                            </Link>
                        </div>

                        <div className={style.trilhaSoftware}>
                            <img src={softwareIcon} alt="Software" />
                            <div>
                                <h3>Software</h3>
                                <p>Decifre a linguagem dos sistemas de forma intuitiva</p>
                            </div>
                            <Link to="/software">
                                <button className={style.btnExplorar}>EXPLORAR &gt;</button>
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
};

export { ConteudoHome };