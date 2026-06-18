import Style from "./modeloBase.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Aula } from "../../../../../funcoes/aula";
import { Usuario } from "../../../../../funcoes/user";
import { PopUpConquista } from "../../../popUpConquistas";
import { PopUp } from "../../../pop-up";

const ArtigoModelo = ({
    subtitulo1, paragrafo1,
    subtitulo2, paragrafo2,
    subtitulo3, paragrafo3,
    subtitulo4, paragrafo4,
    children
}) => {
    return (
        <>
            <h1>Artigo</h1>
            <hr />
            {subtitulo1
                ? (
                    <>
                        {subtitulo1 && <><h2>{subtitulo1}</h2><p>{paragrafo1}</p></>}
                        {subtitulo2 && <><h2>{subtitulo2}</h2><p>{paragrafo2}</p></>}
                        {subtitulo3 && <><h2>{subtitulo3}</h2><p>{paragrafo3}</p></>}
                        {subtitulo4 && <><h2>{subtitulo4}</h2><p>{paragrafo4}</p></>}
                    </>
                )
                : children
            }
        </>
    );
};

const ModeloExecicios = ({
    idExercicio,
    descPergunta,
    opcao1, opcao2, opcao3, opcao4, opcao5,
    numeroPergunta,
    respostaCorreta,
    onAcertar,
    totalPerguntas,
    perguntaAtual
}) => {
    const [respostaSelecionada, setRespostaSelecionada] = useState("");
    const [resultado, setResultado] = useState("");
    const [respondido, setRespondido] = useState(false);

    const token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refresh_token");
    const Navegacao = useNavigate();

    const [token_state, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
    const [dados, setDados] = useState(() => JSON.parse(localStorage.getItem("dados")) || null);
    const set = [setToken, setRefresh, setDados];

    const aula = new Aula(token, refresh_token, Navegacao, set);
    let usuario = JSON.parse(localStorage.getItem("dados"));
    const email = usuario.email;

    async function verificarResposta() {
        setRespondido(true);
        const acertou = respostaSelecionada === respostaCorreta;
        setResultado(acertou ? "Resposta CORRETA!" : "Resposta ERRADA!");
        aula.progredir_exercicio(idExercicio, acertou, email);
    }

    function estiloBotao(opcao) {
        if (!respondido) return respostaSelecionada === opcao ? Style.selecionado : "";
        if (opcao === respostaCorreta) return Style.correta;
        if (opcao === respostaSelecionada && opcao !== respostaCorreta) return Style.errada;
        return "";
    }

    const opcoes = [opcao1, opcao2, opcao3, opcao4, opcao5].filter(Boolean);
    const ultimaPergunta = perguntaAtual === totalPerguntas - 1;

    return (
        <div className={Style.exercicio}>
            <div className={Style.progressoPerguntas}>
                <span>{perguntaAtual + 1} / {totalPerguntas}</span>
            </div>
            <p>{numeroPergunta} - {descPergunta}</p>
            {opcoes.map((opcao, i) => (
                <button
                    key={i}
                    className={estiloBotao(opcao)}
                    onClick={() => setRespostaSelecionada(opcao)}
                    disabled={respondido}
                >
                    {opcao}
                </button>
            ))}
            {!respondido && (
                <button
                    onClick={verificarResposta}
                    disabled={!respostaSelecionada}
                    className={Style.verificarRespostabtn}
                >
                    Verificar resposta
                </button>
            )}
            {resultado && <h2>{resultado}</h2>}
            {respondido && (
                <button
                    className={Style.proximaPerguntaBtn}
                    onClick={() => onAcertar(respostaSelecionada === respostaCorreta)}
                >
                    {ultimaPergunta ? "Concluir" : "Próxima pergunta"}
                </button>
            )}
        </div>
    );
};

const ModeloBase = ({
    carregando,
    idConquista,
    idExercicio,
    tituloAula,
    srcVideo,
    posterVideo,
    tipoMidia,
    proximaAula,
    aulaPassada,
    perguntas,
    subtitulo1, paragrafo1,
    subtitulo2, paragrafo2,
    subtitulo3, paragrafo3,
    subtitulo4, paragrafo4,
    children
}) => {
    const token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refresh_token");
    const Navegacao = useNavigate();

    const [token_state, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
    const [dados, setDados] = useState(() => JSON.parse(localStorage.getItem("dados")) || null);
    const set = [setToken, setRefresh, setDados];

    const [conteudo, setConteudo] = useState("artigo");
    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [popupConquista, setPopupConquista] = useState(null);
    const [popup, setPopup] = useState(null);
    const [acertos, setAcertos] = useState(0);

    let usuario = JSON.parse(localStorage.getItem("dados"));
    const email = usuario.email;

    const aula = new Aula(token, refresh_token, Navegacao, set);
    const user = new Usuario(token, refresh_token, Navegacao, set);

    useEffect(() => {
        if (carregando) return;
        setPerguntaAtual(0);
        setAcertos(0);
    }, [carregando]);

    function trocarConteudo() {
        setConteudo(prev => prev === "artigo" ? "exercicio" : "artigo");
    }

    async function avancarPergunta(acertou) {
        if (acertou) setAcertos(prev => prev + 1);

        if (perguntaAtual < (perguntas?.length ?? 0) - 1) {
            setPerguntaAtual(prev => prev + 1);
        } else {
            await ConcluirAula(acertou);
        }
    }

    async function ConcluirAula(ultimoAcertou) {
        const totalAcertos = acertos + (ultimoAcertou ? 1 : 0);
        const xpTotal = totalAcertos * 200;

        setPopup({
            tipo: 'aviso',
            titulo: 'Aula',
            mensagem: 'Finalizando Aula...'
        });

        await user.conquista(idConquista, setPopupConquista, setDados);
        await user.adicionar_moeda(20, setDados);
        await user.adicionar_xp(xpTotal, setDados);
        await aula.acabar_aula(idExercicio, email, Navegacao);
    }

    const questaoAtual = perguntas?.[perguntaAtual];
    const totalPerguntas = perguntas?.length ?? 0;

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

            <div className={Style.corpo}>
                <div className={Style.separarConteudos}>
                    <div className={Style.parteCima}>
                        <h1>{tituloAula}</h1>
                        <p>+{totalPerguntas * 200} XP ao concluir</p>
                    </div>
                    <div className={Style.parteBaixo}>
                        <div className={Style.containerVideo}>
                            <video controls poster={posterVideo} className={Style.Video}>
                                <source src={srcVideo} type={tipoMidia} />
                            </video>
                        </div>
                        <div className={Style.trocarAula}>
                            <Link to={aulaPassada}><p>aula anterior</p></Link>
                            <Link to={proximaAula}><p>proxima aula</p></Link>
                        </div>
                    </div>
                </div>

                <div className={Style.parteLado}>
                    {conteudo === "artigo" ? (
                        <ArtigoModelo
                            subtitulo1={subtitulo1} paragrafo1={paragrafo1}
                            subtitulo2={subtitulo2} paragrafo2={paragrafo2}
                            subtitulo3={subtitulo3} paragrafo3={paragrafo3}
                            subtitulo4={subtitulo4} paragrafo4={paragrafo4}
                        >
                            {children}
                        </ArtigoModelo>
                    ) : questaoAtual ? (
                        <ModeloExecicios
                            key={perguntaAtual}
                            idExercicio={idExercicio}
                            numeroPergunta={perguntaAtual + 1}
                            descPergunta={questaoAtual.descPergunta}
                            respostaCorreta={questaoAtual.respostaCorreta}
                            opcao1={questaoAtual.opcao1}
                            opcao2={questaoAtual.opcao2}
                            opcao3={questaoAtual.opcao3}
                            opcao4={questaoAtual.opcao4}
                            opcao5={questaoAtual.opcao5}
                            onAcertar={avancarPergunta}
                            totalPerguntas={perguntas.length}
                            perguntaAtual={perguntaAtual}
                        />
                    ) : null}

                    <div className={Style.botoes}>
                        <div className={Style.butaozinho}>
                            <button onClick={trocarConteudo}>
                                {conteudo === "artigo" ? <p>exercicios</p> : <p>artigo</p>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export { ModeloBase };