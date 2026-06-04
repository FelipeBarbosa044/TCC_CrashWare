import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { BotoesForm } from "../../Botoes"
import { CampoTexto } from "../../CampoTexto"
import style from './ConteudoAnotacoes.module.css'
import { PopUp } from '../../pop-up';
import { Annotation } from "../../../../funcoes/annotation";



const ConteudoAnotacao = () => {

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


    const annotation = new Annotation(token, refresh_token, Navegacao, set);

    //Carregador
    const [carregandoNotas, setCarregandoNotas] = useState(true);


    //Popup
    const [popup, setPopup] = useState(null);

    // Anotacoes
    const [anotacoes, setAnotacoes] = useState([])


    async function BuscarAnotacoes() {
        // setPopup({
        //         tipo: 'aviso',
        //         titulo: 'Anotações',
        //         mensagem: 'Buscando suas Anotações...'
        //     });

        //Busco as anotações
        const anotacoesSalvas = await annotation.buscar_anotacao(setPopup, setAnotacoes);

        setCarregandoNotas(false)


    }

    //Trata a Data
    const formatarData = (data) => {
        if (!data) return "";

        return new Date(data).toLocaleDateString("pt-BR");
    };

    // PESQUISA
    const [pesquisar, setPesquisar] = useState("")

    // NOTA SELECIONADA
    const [notaSelecionada, setNotaSelecionada] = useState(null)

    // MODO EDIÇÃO
    const [modoEdicao, setModoEdicao] = useState(false)

    // DADOS DA NOTA
    const [infoNota, setInfoNota] = useState({

        tituloAnotacao: "",

        textoAnotacao: ""
    })

    // //Busco a anotação sempre que a pag for carregada
    useEffect(() => {

        BuscarAnotacoes();

    }, [])

    // CRIAR NOTA
    const criarNota = async () => {

        if (infoNota.tituloAnotacao.trim() === "") {
            setPopup({
                tipo: 'aviso',
                titulo: 'Título',
                mensagem: 'O Título Deve Ser Preenchido'
            });

            return;
        }


        setPopup({
            tipo: 'aviso',
            titulo: 'Anotação',
            mensagem: 'Criando Anotação...'
        });

        //Chamo o método de criar anotação
        //Crio a anotação no banco de dados
        const anotacao = await annotation.adicionar_anotacao(infoNota.tituloAnotacao, infoNota.textoAnotacao, setPopup)

        const nova = {

            id_anotacao: anotacao?.id,

            titulo: infoNota.tituloAnotacao,

            texto: infoNota.textoAnotacao,

            criado_em: formatarData(anotacao?.criado_em),

            atualizado_em: formatarData(anotacao?.atualizado_em)
        }

        //Espalha as anotações antiga
        setAnotacoes(prev => [nova, ...prev])

        // Seleciona nota criada
        setNotaSelecionada(nova)

        // Bloqueia edição
        setModoEdicao(false)
    }

    // NOVA NOTA
    const novaNota = () => {

        // Remove seleção
        setNotaSelecionada(null)

        // Limpa campos
        setInfoNota({

            tituloAnotacao: "",

            textoAnotacao: ""
        })

        // Libera edição
        setModoEdicao(true)
    }

    // SELECIONAR NOTA
    const selecionarNota = (nota) => {

        setNotaSelecionada(nota)

        setInfoNota({

            tituloAnotacao: nota.titulo,

            textoAnotacao: nota.texto
        })

        // Bloqueia edição
        setModoEdicao(false)
    }

    // EDITAR / SALVAR
    const editarNota = async () => {

        if (!notaSelecionada) return

        // Ativa edição
        if (!modoEdicao) {

            setModoEdicao(true)

            return;
        }

        if (infoNota.tituloAnotacao.trim() === "") {
            setPopup({
                tipo: "aviso",
                titulo: "Título",
                mensagem: "O título Deve Ser Preenchido"
            });

            return;
        }

        //Chamo a o método de editar anotação
        //Salvo no Banco de Dados
        const anotacao_atualizada = await annotation.editar_anotacao(infoNota.tituloAnotacao, infoNota.textoAnotacao, notaSelecionada.id_anotacao, setPopup)

        //Caso a anotação atualizada retorne vazia
        if (!anotacao_atualizada) {
            return;
        }


        // Salva as alterações no react
        const notasAtualizadas = anotacoes.map((nota) => {

            if (nota.id_anotacao === notaSelecionada.id_anotacao) {

                return {

                    ...nota,

                    titulo: infoNota.tituloAnotacao,

                    texto: infoNota.textoAnotacao,

                    atualizado_em: formatarData(anotacao_atualizada?.atualizado_em)
                }
            }

            return nota
        })

        setAnotacoes(notasAtualizadas)

        // Atualiza nota selecionada
        const notaAtualizada = notasAtualizadas.find(
            nota => nota.id_anotacao === notaSelecionada.id_anotacao
        )

        setNotaSelecionada(notaAtualizada)

        // Sai edição
        setModoEdicao(false)
    }

    // EXCLUIR NOTA
    const excluirNota = async () => {

        if (!notaSelecionada) {
            return;
        }

        //Apago no banco de dados
        const deletado = await annotation.deletar_anotacao(notaSelecionada.id_anotacao, setPopup)

        //Caso o deletar retornar False
        if (deletado == false) {
            return;
        }

        //Atualiza no React
        const notasFiltradas = anotacoes.filter(
            nota => nota.id_anotacao !== notaSelecionada.id_anotacao
        )

        setAnotacoes(notasFiltradas)

        // Limpa seleção
        setNotaSelecionada(null)

        // Limpa campos
        setInfoNota({

            tituloAnotacao: "",

            textoAnotacao: ""
        })

        // Sai edição
        setModoEdicao(false)
    }

    //Filtragem
    const anotacoesFiltradas = anotacoes.filter(n =>

        (n.titulo || "").toLowerCase().includes(pesquisar.toLowerCase()) ||
        (n.texto || "").toLowerCase().includes(pesquisar.toLowerCase())
    )


    // ITEM LATERAL
    const ItensBarraLateral = ({
        nota,
        onClick
    }) => {

        return (

            <div
                className={style.itemBarraLateral}
                onClick={onClick}
            >

                <p>{nota.titulo}</p>

                <div>
                    {formatarData(nota.criado_em)}
                </div>

            </div>
        )

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
            <div className={style.corpo}>

                <div className={style.container}>
                    {/* ESQUERDA */}
                    <div className={style.coluna_esquerda}>
                        <div className={style.barraLateral}>
                            {/* HEADER */}
                            <div className={style.barraLateral_header}>
                                <CampoTexto
                                    placeholder="Pesquisar"
                                    className={style.barraLateral_campoPesquisa}
                                    value={pesquisar}
                                    onChange={(e) =>
                                        setPesquisar(e.target.value)
                                    }
                                />
                            </div>
                            {/* LISTA */}
                            <div className={style.barraLateral_listaNotas}>

                                {carregandoNotas ? (
                                    <div className={style.giradorLegal_Notas} />
                                ) :
                                    anotacoesFiltradas.length === 0 ? (
                                        <p className={style.TextoMotivador}>Anotar oque se aprende é essencial para manter gravado no seu SDD</p>
                                    ) :
                                        (
                                            anotacoesFiltradas.map((nota) => (
                                                <ItensBarraLateral
                                                    key={nota.id_anotacao}
                                                    nota={nota}
                                                    onClick={() =>
                                                        selecionarNota(nota)
                                                    }
                                                />
                                            )))}
                            </div>
                        </div>
                    </div>
                    {/* DIREITA */}
                    <div className={style.coluna_direita}>
                        <div className={style.nota_cabecalho}>
                            <h1>Titulo da Anotação</h1>
                            {/* INPUT TITULO */}
                            <input
                                type="text"
                                maxLength={150}
                                placeholder="Adicione o Título da Anotação"
                                className={style.nota_inputTitulo}
                                value={infoNota.tituloAnotacao}
                                disabled={
                                    notaSelecionada && !modoEdicao
                                }
                                onChange={(e) =>
                                    setInfoNota({
                                        ...infoNota,
                                        tituloAnotacao: e.target.value
                                    })
                                }
                            />
                            {/* BOTÃO EDITAR / SALVAR */}
                            {
                                notaSelecionada && (
                                    <BotoesForm
                                        texto={
                                            modoEdicao
                                                ? "Salvar"
                                                : "Editar"
                                        }
                                        className={style.nota_botaoEditar}
                                        onClick={editarNota}
                                    />
                                )
                            }
                            {/* BOTÃO EXCLUIR */}
                            {
                                notaSelecionada && (
                                    <BotoesForm
                                        texto="Excluir nota"
                                        className={style.nota_botaoExcluir}
                                        onClick={excluirNota}
                                    />
                                )
                            }
                            {/* DATAS */}
                            <div className={style.nota_infoDatas}>
                                <h5>
                                    Criado em: {
                                        notaSelecionada
                                            ? formatarData(notaSelecionada.criado_em)
                                            : ""
                                    }
                                </h5>
                                <h5>
                                    Editado em: {
                                        notaSelecionada
                                            ? formatarData(notaSelecionada.atualizado_em)
                                            : ""
                                    }
                                </h5>
                            </div>
                        </div>
                        {/* CONTEÚDO */}
                        <div className={style.nota_blocoTexto}>
                            <textarea
                                className={style.nota_textarea}
                                placeholder="Digite sua anotação"
                                value={infoNota.textoAnotacao}
                                disabled={
                                    notaSelecionada && !modoEdicao
                                }
                                onChange={(e) =>
                                    setInfoNota({
                                        ...infoNota,
                                        textoAnotacao: e.target.value
                                    })
                                }
                            />
                        </div>
                        {/* BOTÃO */}
                        {
                            notaSelecionada ? (
                                <button
                                    className={style.nota_botaoCriar}
                                    onClick={novaNota}
                                >
                                    <p>Nova nota</p>
                                </button>
                            ) : (
                                <button
                                    className={style.nota_botaoCriar}
                                    onClick={criarNota}
                                >
                                    <p>Criar nota</p>
                                </button>
                            )
                        }
                    </div>
                </div>

            </div>
        </>
    )
}

export { ConteudoAnotacao }