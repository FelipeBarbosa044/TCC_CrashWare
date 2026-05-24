import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Raposa from '../../../fotos/Raposa.svg';
import FotoPadrao from '../../../fotos/FotoPerfilPadrao.jpeg';
import iconConquistas from '../../../fotos/Conquistas.svg';
import iconOfensiva from '../../../fotos/Ofensiva.svg';
import iconGema from '../../../fotos/Gemas.svg';
import iconTema from '../../../fotos/Item_tema.svg';
import hardwareIcon from '../../../fotos/hardware.svg';
import softwareIcon from '../../../fotos/software.svg';

import style from './ConteudoPerfil.module.css'
import { useNavigate } from "react-router-dom"

import { Api, SairDaConta } from '../../../../funcoes/functions'
import { BotoesForm } from '../../Botoes/BotaoForm/BotaoForm'
import { Usuario } from '../../../../funcoes/user'
import { PopUpConquista } from "../../popUpConquistas";
import { PopUp } from '../../pop-up'



const ConteudoPerfil = () => {

    // Dados de exemplo para as conquistas — substitua pelos dados reais da API
    let CONQUISTAS_MOCK = [];

    //Navegação --> Permite eu levar o usuario para outras telas
    const Navegacao = useNavigate();

    const token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refresh_token");

    //SetMaiorOfensiva
    const [maiorOfensiva, setMaiorOfensiva] = useState(
    localStorage.getItem("maior_ofensiva") || 0
    );

    //Uso useState para o react renderizar as informações
    const [token_state, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
    const [dados, setDados] = useState(() =>
        JSON.parse(localStorage.getItem("dados")) || null
    );

    //Lista que contém todos os usestate
    const set = [setToken, setRefresh, setDados];


    //Pego as informações do usuario
    let usuario = JSON.parse(localStorage.getItem("dados"));

    //Patente
    const Patente = usuario?.patente || "Beta";

    
    //Trata a data do mês
    const DataCadastro = usuario?.criado_em;

    const formatarData = (DataCadastro) => {
        const [dia, mes, ano] = DataCadastro.split('/');
        const date = new Date(`${ano}-${mes}-${dia}`);

        const mesNome = date.toLocaleString('pt-BR', { month: 'long' });

        return `Membro desde ${mesNome} de ${ano}`;
    };
    
    // muda a foto
    const [foto, setFoto] = useState(usuario?.foto);
    const [banner, setBanner] = useState(usuario?.banner);
    const [MudarFoto, setMudarFoto] = useState(false);
    const [MudarBanner, setMudarBanner] = useState(false);
    const [aberto, setAberto] = useState(false);
    
    //Cache da foto
    const [versaoFoto, setVersaoFoto] = useState(Date.now());
    const [versaoBanner, setVersaoBanner] = useState(Date.now());
    
    const inputRef = useRef();
    const inputBanner = useRef();
    
    const [ofensiva, setOfensiva] = useState(0);
    const [xp, setXp] = useState(usuario?.xp || 0);
    const [conquistas, setConquistas] = useState(CONQUISTAS_MOCK);
    const [totalCompras, setTotalCompras] = useState(0);
    const [totalGemas, setTotalGemas] = useState(usuario?.moedas);
    const [popup, setPopup] = useState(null);

    const XpMax = 500;
    const Nivel = 1;
    const nome = usuario?.nome || "Usuário";

    const xpAtual = xp % XpMax;
    const porcentagem = (xp / XpMax) * 100;
    
    //Click
    const [click, setClick] = useState(0);
    
    //PopupConquista
    const [popupConquista, setPopupConquista] = useState(null);
    
    if (click >= 10) {
        //Crio o bjeto que contem requisições para o banco
        const user = new Usuario(token, refresh_token, Navegacao, set);
        user.conquista(15, setPopupConquista, setDados)
    }
    
    
    
    useEffect(() => {
        
        carregarConquistas();
        
        const onVisible = () => {
            
            //Atualiza os dados do usuario, sempre que a pagina for acessada
            if (!document.hidden) {
                //Pego os dados
                const user = new Usuario(token, refresh_token, Navegacao, set);
                user.perfil(setDados);
                usuario = JSON.parse(localStorage.getItem("dados"));

                //Valido a ofensiva
                const usuario = new Usuario(setMaiorOfensiva);
            }
        };

        document.addEventListener("visibilitychange", onVisible);

        return () => {
            document.removeEventListener("visibilitychange", onVisible);
        };

    }, []);



    async function carregarConquistas() {

        //Reseto as conquistas
        CONQUISTAS_MOCK = [];

        const user = new Usuario(token, refresh_token, Navegacao, set);
        await user.mostrar_conquista();

        //Pega as conquistas
        const usuario_conquistas = JSON.parse(localStorage.getItem("usuario_conquistas") || "[]");

        //Pego a quantidade de consquistas
        let quantidade_conquistas = usuario_conquistas.length

        //Adiciono as conquistas na interface

        for (let n = 0; n < quantidade_conquistas; n++) {
            CONQUISTAS_MOCK.push({ titulo: usuario_conquistas[n].nome_conquista, descricao: usuario_conquistas[n].descricao })
        }

        //Exibo na hora as conquistas
        setConquistas(CONQUISTAS_MOCK)

        //
    }

    if (!usuario) {
        return (
            <div className={style.corpo} style={{ justifyContent: 'center' }}>
                <span style={{ color: '#8b90a0', letterSpacing: '0.1em', fontSize: '13px' }}>
                    CARREGANDO...
                </span>
            </div>
        );
    }


    return (
        <>
            {/*Popup Padrão]*/}
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


            < div className={style.corpo}>

                {/* ── Banner ─────────────────────────────────────── */}
                <div className={style.banner}>
                    <img
                        src={`https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/banner/${usuario?.banner}?v=${versaoBanner}`} alt="Banner do usuário"
                        onClick={() => setMudarBanner(!MudarBanner)}
                    />

                </div>

                <div className={style.container}>
                    {MudarBanner && (

                        <div className={MudarBanner ? style.Aberto_Banner : style.Fechado}>
                            <BotoesForm
                                texto="Mudar Banner"
                                onClick={() => inputBanner.current.click()}
                            />
                            <BotoesForm
                                texto="Remover Banner"
                                onClick={() => {
                                    if (banner == 'default.png') {
                                        setPopup({
                                            tipo: 'erro',
                                            titulo: 'Banner',
                                            mensagem: 'Você precisa adicionar uma banner , para realizar essa ação'
                                        });
                                    } else {
                                        const banner_usuario = new Usuario(token, refresh_token, Navegacao, set);
                                        banner_usuario.remover_banner(setDados, setBanner, setPopup);
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Banner */}
                    <input
                        type="file"
                        className={style.escondido}
                        ref={inputBanner}
                        accept='image/*'
                        onChange={(e) => {
                            const arquivo = e.target.files[0];
                            if (arquivo) {
                                //Salva por enqaunto a imagem no navegador
                                // const novaFoto = URL.createObjectURL(arquivo);
                                // setFoto(novaFoto);


                                //Salvo como arquivo
                                const conteudo = new FormData();
                                conteudo.append("banner", arquivo);

                                if (banner == 'default.png') {
                                    //Adiciono a foto
                                    const banner_usuario = new Usuario(token, refresh_token, Navegacao, set);
                                    banner_usuario.adicionar_banner(conteudo, setBanner, setDados, setPopup);

                                } else {
                                    //Altero a foto
                                    const banner_usuario = new Usuario(token, refresh_token, Navegacao, set);
                                    banner_usuario.alterar_banner(conteudo, setBanner, setDados, setPopup, setVersaoBanner);

                                }
                            }
                        }}
                    />


                    {/* ── Foto ─────────────────────────────────────── */}
                    <div className={style.apresentacao}>
                        <img
                            className={style.foto}
                            src={`https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/${usuario?.foto}?v=${versaoFoto}`}
                            alt="Foto de perfil"
                            onClick={() => setMudarFoto(!MudarFoto)}
                        />

                        {MudarFoto && (
                            <div className={MudarFoto ? style.Aberto : style.Fechado}>
                                <BotoesForm
                                    texto="Mudar Foto"
                                    onClick={() => inputRef.current.click()}
                                />
                                <BotoesForm
                                    texto="Remover Foto"
                                    onClick={() => {
                                        if (foto == 'default.png') {
                                            setPopup({
                                                tipo: 'erro',
                                                titulo: 'Foto',
                                                mensagem: 'Você precisa adicionar uma foto , para realizar essa ação'
                                            });
                                        } else {
                                            const foto_usuario = new Usuario(token, refresh_token, Navegacao, set);
                                            foto_usuario.remover_foto(setDados, setFoto, setPopup);
                                        }

                                    }}
                                />
                            </div>
                        )}

                        {/* Foto */}
                        <input
                            type="file"
                            className={style.escondido}
                            ref={inputRef}
                            accept='image/*'
                            onChange={(e) => {
                                const arquivo = e.target.files[0];
                                if (arquivo) {
                                    //Salva por enqaunto a imagem no navegador
                                    // const novaFoto = URL.createObjectURL(arquivo);
                                    // setFoto(novaFoto);


                                    //Salvo como arquivo
                                    const conteudo = new FormData();
                                    conteudo.append("foto", arquivo);

                                    if (foto == 'default.png') {
                                        //Adiciono a foto
                                        const foto_usuario = new Usuario(token, refresh_token, Navegacao, set);
                                        foto_usuario.adicionar_foto(conteudo, setFoto, setDados, setPopup);

                                    } else {
                                        //Altero a foto
                                        const foto_usuario = new Usuario(token, refresh_token, Navegacao, set);
                                        foto_usuario.alterar_foto(conteudo, setFoto, setDados, setPopup, setVersaoFoto);

                                    }
                                }
                            }}
                        />

                        <input
                            type="file"
                            className={style.escondido}
                            ref={inputBanner}
                            accept='image/*'
                            onChange={(e) => {
                                const arquivo = e.target.files[0];
                                if (arquivo) {
                                    //Salva por enqaunto a imagem no navegador
                                    // const novaFoto = URL.createObjectURL(arquivo);
                                    // setFoto(novaFoto);

                                    //Salvo como arquivo
                                    const conteudo = new FormData();
                                    conteudo.append("banner", arquivo);

                                    if (banner == 'default.png') {
                                        //Adiciono o banner
                                        const banner_usuario = new Usuario(token, refresh_token, Navegacao, set);
                                        banner_usuario.adicionar_banner(conteudo, setBanner, setDados, setPopup);

                                    } else {
                                        //Altero o banner
                                        const banner_usuario = new Usuario(token, refresh_token, Navegacao, set);
                                        banner_usuario.alterar_banner(conteudo, setBanner, setDados, setPopup, setVersaoBanner);

                                    }
                                }
                            }}
                        />

                        <div className={style.texto}>
                            <h3>{nome}</h3>

                            <div className={style.status}>
                                <span className={style.bolinha}></span>
                                <p>{formatarData(DataCadastro)}</p>
                            </div>

                            <div className={style.Nivel}>
                                <div className={style.NivelTopo}>
                                    <p>Nível {Nivel}</p>
                                    <span>{xpAtual}/{XpMax} XP</span>
                                </div>

                                <div className={style.Barra}>
                                    <div
                                        className={style.Progresso}
                                        style={{ width: `${porcentagem}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={style.raposa}>
                            <img src={Raposa} alt="Crash"
                                onClick={() => setClick(click + 1)}
                            />
                        </div>
                    </div>

                    {/* ── Cards de Stats ─────────────────────────── */}
                    <div className={style.blocos}>

                        <div className={style.Conquistas}>
                            <img src={iconConquistas} alt="Conquistas" />
                            <div>
                                {conquistas.length}
                                <p>Conquistas</p>
                            </div>
                        </div>

                        <div className={style.Patente}>
                            <img src={iconOfensiva} alt="Compras" />
                            <div>
                                <h1>{Patente}</h1>
                                <p>Patente</p>
                            </div>
                        </div>

                        <div className={style.Gemas}>
                            <img src={iconGema} alt="Gemas" />
                            <div>
                                {totalGemas}
                                <p>Gemas</p>
                            </div>
                        </div>

                    </div>

                    {/* ── Última Compra ──────────────────────────── */}
                    <div className={style.Historico_Compras}>
                        <h1>Última Compra</h1>

                        <div className={style.CompraRecente}>
                            <img src={iconTema} alt="Item" />

                            <div className={style.DescricaoCompra}>
                                <h5>Meia-Noite</h5>
                                <p>Para quando o modo escuro não for suficiente</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Painel Direito: Conquistas ─────────────── */}
                    <div className={style.Direita}>
                        <div className={style.ConquistasBloco}>
                            <h4>Conquistas</h4>

                            <div className={style.listaConquistas}>
                                {conquistas.map((c) => (
                                    <div
                                        key={c.id}
                                        className={`${style.ItemConquista} ${style[c.tipo]}`}
                                    >
                                        <img src={FotoPadrao} alt={c.titulo} />

                                        <div>
                                            <h6>{c.titulo}</h6>
                                            <p>{c.descricao}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className={style.verTodas}>
                                <p>Ver todas as conquistas</p>
                            </button>
                        </div>
                    </div>

                    {/* <div className={style.trilhas}>

                        <div className={style.trilhaHardware}>

                            <img src={hardwareIcon} alt="simbolo do hardware" />

                            <div className={style.informacoesHardware}>
                                <h1>Hardware</h1>
                                <p>Desvende a arquitetura das máquinas de forma acessivel</p>
                            </div>

                            <Link to="/hardware">
                                <button>Explorar</button>
                            </Link>
                        
                        </div>

                        <div className={style.trilhaSoftware}>

                            <img src={softwareIcon} alt="Simbolo de software" />

                                <div className={style.informacoesSoftware}>
                                    <h1>software</h1>
                                    <p>Decifre a linguagem dos sitemas de forma intuitiva</p>
                                </div>

                            <Link to="/software">
                                <button>Explorar</button>
                            </Link>

                        </div>
                        
                    </div> */}

                </div>
            </div >
        </>
    );
};

export { ConteudoPerfil }