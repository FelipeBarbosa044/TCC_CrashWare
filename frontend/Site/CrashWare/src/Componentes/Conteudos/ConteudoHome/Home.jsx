import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Usuario } from "../../../../funcoes/user";
import style from "./ConteudoHome.module.css";


import hardwareIcon from "../../../fotos/hardware.svg";
import softwareIcon from "../../../fotos/software.svg";
import raposaIcon from "../../../fotos/Raposa.svg";
import raposaSad from "../../../fotos/Raposa-Sad.svg";

import { PopUp } from '../../pop-up';
import { PopUpConquista } from "../../popUpConquistas";
import { PopUpBanido } from "../../popUpBanido/PopUpBanido";
import { Annotation } from "../../../../funcoes/annotation";



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

    //Carregamento
    const [carregando, setCarregando] = useState(!JSON.parse(localStorage.getItem("dados")));


    const informacoes = localStorage.getItem("info")

    async function VerificarOfensiva() {
        const user = new Usuario(token, refresh_token, Navegacao, set);

        await user.ValidarOfensiva(setMaiorOfensiva, setDados);
        usuario = JSON.parse(localStorage.getItem("dados"));

    }

    //Objeto da classe annotation
    const annotation = new Annotation(token, refresh_token, Navegacao, set);

    //Array que contém as ultimas anotações
    const [anotacaoItens, setAnotacaoItens] = useState([]);

    //Trata a Data
    const formatarData = (data) => {
        if (!data) return "";

        return new Date(data).toLocaleDateString("pt-BR");
    };


    const [carregandoAnotacoes, setCarregandoAnotacoes] = useState(true);
    //Exibie na tela as anotações
    async function atualizarAnotacoes() {

        setCarregandoAnotacoes(true); 
        //Busco as ultimas anotações
        const anotacao = await annotation.buscar_anotacao(setPopup)

        //Quantidade de anotações
        const tamanho_anotacoes = anotacao.length;

        if (tamanho_anotacoes > 0) {
            const novasAnotacoes = [];
            for (let n = 0; n < 3 && n < tamanho_anotacoes; n++) {
                novasAnotacoes.push({
                    titulo: anotacao[n]?.titulo,
                    data: formatarData(anotacao[n]?.atualizado_em)
                });
            }
            setAnotacaoItens(novasAnotacoes);
        }

        setCarregandoAnotacoes(false)
    }


    async function CarregarInformacoes() {
    const user = new Usuario(token, refresh_token, Navegacao, set);

    //Conquista ao Logar
    await user.conquista(9, setPopupConquista, setDados)

    //Carrega ofensiva + informações do usuarios em parelelo.
    await Promise.all([
        // sincronizar + validar ofensiva em sequência 
        user.SicronizarOfensiva(setPopup).then(() => VerificarOfensiva()),
        // Carrego informações do usuario
        atualizarAnotacoes(),
        user.perfil(setDados),
        
    ]);

    // Avisa o LayoutLogado que os dados do usuário chegaram
    window.dispatchEvent(new Event("dadosAtualizados"));

    setCarregando(false);
    }

    //Pega os dados do usuario
    let usuario = JSON.parse(localStorage.getItem("dados"));


    //Conquista do ADM
    async function VerificarADM() {
    if (usuario.adm == true) {
            //Crio o bjeto que contem requisições para o banco
            const user = new Usuario(token, refresh_token, Navegacao, set);

            //Pega a conquista de ADM
            await user.conquista(23, setPopupConquista, setDados);
        }
    }

    useEffect(() => {
        //Verifico se usuario esta banido/desativado
        if (usuario?.ativo === false) {
            setBanido(true);
        }
    }, [usuario?.ativo]);

    
    let xp = usuario?.xp ?? 0;
    const xpAtual = xp % 500;
    const porcentagem = (xpAtual / 500) * 100;
    const nome = usuario?.nome ?? "Usuário";
    const [patente, setPatente] = useState(usuario?.patente);

    //Calcula o nível
    const Nivel = Math.min(Math.floor(xp / 500) + 1, 15);


    //Ofensiva
    const ofensiva = usuario?.ofensiva ?? 0;

    useEffect(() => {
         
        async function inicializar() {
            //Verifico se esta vindo do login
            if (localStorage.getItem("info") === "false") {
                await CarregarInformacoes(); // Carrega as informações
            } else {
                setCarregando(false);
                atualizarAnotacoes(); //Só carrega se o login do usuario for antigo 
            }

            // Só roda depois qie outras informações forem carregadas
            await atualizarRecursos();
            VerificarOfensiva();
            VerificarADM();
        }
                

        //Chamo a função de inicializar
        inicializar();
    }, []);


    
    //Atualizo XP/GEMA e Patente
    async function atualizarRecursos() 
    {
        //Crio o bjeto que contem requisições para o banco
        const user = new Usuario(token, refresh_token, Navegacao, set);

        //Verifico Patente
        await user.subir_patente(usuario?.email,setPatente,setDados)
        
        //Atualizo os xp e gema
        user.atulizar_recursos(usuario?.email,setDados)
    }


    const ultimaAula = {
        trilha: "Hardware",
        numero: "Aula 2",
        titulo: "Como vai funcionar esse curso?",
        proximoModulo: "Introdução ao Hardware",
    };

    if (carregando && !usuario) {
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

            
                  
        <PopUpConquista
          tipo="hardware"
          titulo="Primeira conquista!"
          mensagem="Você completou o módulo de Hardware."
          onFechar={() => setMostrarPopup(false)}
        />
            <div className={style.corpo}>
                <div className={style.header}>

                    <div className={style.headerUsuario}>
                        <img
                            className={style.foto}
                            src={`https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/${usuario?.foto}`}
                            alt="Foto de perfil"
                            onClick={() => {
                                window.location.href = '/perfil'
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
                            <img src={maiorOfensiva > ofensiva && ofensiva == 1 ? raposaSad : raposaIcon} alt="" />
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
                            {carregandoAnotacoes ? (
                                <div className={style.giradorLegal_Anotacao} />
                            ) :
                                anotacaoItens.length === 0 ? (
                                    <p className={style.TextoMotivador}>Que tal iniciar o hábito da escrita? Você não vai se arrepender</p>
                                ) : (
                                    anotacaoItens.map((a, index) => (
                                        <div key={index} className={style.itemAnotacao}>
                                            <p className={style.anotacaoTitulo}>{a.titulo}</p>
                                            <span className={style.anotacaoData}>{a.data}</span>
                                        </div>
                                    ))
                                )}

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