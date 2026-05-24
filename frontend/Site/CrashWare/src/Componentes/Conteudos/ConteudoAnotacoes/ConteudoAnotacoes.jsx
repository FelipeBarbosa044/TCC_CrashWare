import { useState, useEffect } from "react"
import { BotoesForm } from "../../Botoes"
import { CampoTexto } from "../../CampoTexto"
import style from './ConteudoAnotacoes.module.css'

const ConteudoAnotacao = () => {

    // =========================================
    // LOCAL STORAGE
    // =========================================
    const [anotacoes, setAnotacoes] = useState(() => {

        const salvas = localStorage.getItem('anotacoes')

        return salvas ? JSON.parse(salvas) : []
    })

    // =========================================
    // PESQUISA
    // =========================================
    const [pesquisar, setPesquisar] = useState("")

    // =========================================
    // NOTA SELECIONADA
    // =========================================
    const [notaSelecionada, setNotaSelecionada] = useState(null)

    // =========================================
    // MODO EDIÇÃO
    // =========================================
    const [modoEdicao, setModoEdicao] = useState(false)

    // =========================================
    // DADOS DA NOTA
    // =========================================
    const [infoNota, setInfoNota] = useState({

        tituloAnotacao: "",

        textoAnotacao: ""
    })

    // =========================================
    // SALVAR LOCAL STORAGE
    // =========================================
    useEffect(() => {

        localStorage.setItem(
            'anotacoes',
            JSON.stringify(anotacoes)
        )

    }, [anotacoes])

    // =========================================
    // CRIAR NOTA
    // =========================================
    const criarNota = () => {

        if (
            infoNota.tituloAnotacao.trim() === "" &&
            infoNota.textoAnotacao.trim() === ""
        ) {
            return
        }

        const nova = {

            id: Date.now(),

            titulo: infoNota.tituloAnotacao,

            conteudo: infoNota.textoAnotacao,

            criadoEm: new Date().toLocaleDateString('pt-BR'),

            editadoEm: new Date().toLocaleDateString('pt-BR')
        }

        setAnotacoes(prev => [nova, ...prev])

        // Seleciona nota criada
        setNotaSelecionada(nova)

        // Bloqueia edição
        setModoEdicao(false)
    }

    // =========================================
    // NOVA NOTA
    // =========================================
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

    // =========================================
    // SELECIONAR NOTA
    // =========================================
    const selecionarNota = (nota) => {

        setNotaSelecionada(nota)

        setInfoNota({

            tituloAnotacao: nota.titulo,

            textoAnotacao: nota.conteudo
        })

        // Bloqueia edição
        setModoEdicao(false)
    }

    // =========================================
    // EDITAR / SALVAR
    // =========================================
    const editarNota = () => {

        if (!notaSelecionada) return

        // Ativa edição
        if (!modoEdicao) {

            setModoEdicao(true)

            return
        }

        // Salvar alterações
        const notasAtualizadas = anotacoes.map((nota) => {

            if (nota.id === notaSelecionada.id) {

                return {

                    ...nota,

                    titulo: infoNota.tituloAnotacao,

                    conteudo: infoNota.textoAnotacao,

                    editadoEm: new Date().toLocaleDateString('pt-BR')
                }
            }

            return nota
        })

        setAnotacoes(notasAtualizadas)

        // Atualiza nota selecionada
        const notaAtualizada = notasAtualizadas.find(
            nota => nota.id === notaSelecionada.id
        )

        setNotaSelecionada(notaAtualizada)

        // Sai edição
        setModoEdicao(false)
    }

    // =========================================
    // EXCLUIR NOTA
    // =========================================
    const excluirNota = () => {

        if (!notaSelecionada) return

        const notasFiltradas = anotacoes.filter(
            nota => nota.id !== notaSelecionada.id
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

    // =========================================
    // FILTRAGEM
    // =========================================
    const anotacoesFiltradas = anotacoes.filter(n =>

        n.titulo.toLowerCase().includes(
            pesquisar.toLowerCase()
        ) ||

        n.conteudo.toLowerCase().includes(
            pesquisar.toLowerCase()
        )
    )

    // =========================================
    // ITEM LATERAL
    // =========================================
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
                    {nota.criadoEm}
                </div>

            </div>
        )
    }

    return (

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
                            {anotacoesFiltradas.map((nota) => (
                                <ItensBarraLateral
                                    key={nota.id}
                                    nota={nota}
                                    onClick={() =>
                                        selecionarNota(nota)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
                {/* DIREITA */}
                <div className={style.coluna_direita}>
                    <div className={style.nota_cabecalho}>
                        <h1>Titulo da Aula</h1>
                        {/* INPUT TITULO */}
                        <input
                            type="text"
                            placeholder="Adicione o titulo da aula"
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
                                        ? notaSelecionada.criadoEm
                                        : ""
                                }
                            </h5>
                            <h5>
                                Editado em: {
                                    notaSelecionada
                                        ? notaSelecionada.editadoEm
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
    )
}

export { ConteudoAnotacao }