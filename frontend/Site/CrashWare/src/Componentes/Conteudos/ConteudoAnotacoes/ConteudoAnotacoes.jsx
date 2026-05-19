import { useState, useEffect } from "react"
import { BotoesForm } from "../../Botoes"
import { CampoTexto } from "../../CampoTexto"
import style from './ConteudoAnotacoes.module.css'

const ConteudoAnotacao = () => {

    //Salva no localStorage
    const [anotacoes, setAnotacoes] = useState(() => {
        const salvas = localStorage.getItem('anotacoes')
        return salvas ? JSON.parse(salvas) : []
    })

    const [pesquisar, setPesquisar] = useState("");
    const [editando, setEditando] = useState(false);
    const [anotacaoAtiva, setAnotacaoAtiva] = useState(null);

    //Salva no localStorage
    useEffect(() => {
        localStorage.setItem('anotacoes', JSON.stringify(anotacoes))
    }, [anotacoes])

    //Criação de Nova Nota
    const criarNota = () => {
        const nova = {
            id: Date.now(),
            titulo: "Nova Nota",
            conteudo: "",
            criadoEm: new Date().toLocaleDateString('pt-BR'),
            editadoEm: new Date().toLocaleDateString('pt-BR'),
        }
        setAnotacoes(prev => [nova, ...prev])
        setAnotacaoAtiva(nova)
        setEditando(true)
    }

    //Ediçao
    const salvarNota = () => {
        if (!anotacaoAtiva) return
        const atualizada = {
            ...anotacaoAtiva,
            editadoEm: new Date().toLocaleDateString('pt-BR'),
        }
        setAnotacoes(prev =>
            prev.map(n => n.id === atualizada.id ? atualizada : n)
        )
        setAnotacaoAtiva(atualizada)
        setEditando(false)
    }

    const atualizarCampo = (campo, valor) => {
        setAnotacaoAtiva(prev => ({ ...prev, [campo]: valor }))
    }

    //Filtragem
    const anotacoesFiltradas = anotacoes.filter(n =>
        n.titulo.toLowerCase().includes(pesquisa.toLowerCase()) ||
        n.conteudo.toLowerCase().includes(pesquisa.toLowerCase())
    )

    return (
        <div className={style.corpo}>

            <div className={style.Esquerda}>
                <div className={style.BarraLateral}> {/*Barra Lateral*/}
                    <div className={style.HeaderLateral}> {/*Header da Barra Lateral*/}
                        <BotoesForm
                            texto="+ Nova Nota"
                            className={style.BotaoNovaNota}
                        // onClick={criarNota}
                        />
                        {/* Campo de Pesquisa */}
                        <CampoTexto
                            placeholder="Pesquisar"
                            className={style.Pesquisa}
                        />
                    </div> {/*Header*/}

                    <div className={style.ItensAnotacoes}>
                        <p>Anotação 1</p>
                        <p>Item 2</p>
                        <p>Item 3</p>
                        <p>Item 4</p>
                        <p>Item 5</p>
                        <p>Item 6</p>
                    </div> {/*Anotaçoes/botoes*/}
                    {/* Anotações Salvas do Usuario acho q vou ter q fazer outro componente uma lista*/}
                </div>
            </div>

            <div className={style.Direita}>
                <div className={style.BlocoCima}> {/*bloco cima*/}
                    <h1>Titulo da Aula</h1>
                    <BotoesForm
                        texto="Editar"
                        className={style.BotaoEditar}
                    />
                    <div className={style.BlocoInfos}>
                        <h5>Criado em: </h5>
                        <h5>Editado em: </h5>
                    </div>
                </div>

                <div className={style.BlocodeNotas}>
                    {/*Campo de escrever*/}
                    <textarea
                        className={style.textArea}
                        placeholder="Digite suas anotações..."
                    />
                </div>
            </div>
        </div>

    )
}

export { ConteudoAnotacao }