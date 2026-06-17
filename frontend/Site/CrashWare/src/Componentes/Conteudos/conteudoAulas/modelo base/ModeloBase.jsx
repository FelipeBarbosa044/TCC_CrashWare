import Style from "./modeloBase.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

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
    descPergunta,
    opcao1,
    opcao2,
    opcao3,
    opcao4,
    opcao5,
    numeroPergunta,
    respostaCorreta,
    onAcertar,
    totalPerguntas,
    perguntaAtual
}) => {

    const [respostaSelecionada, setRespostaSelecionada] = useState("");
    const [resultado, setResultado] = useState("");
    const [respondido, setRespondido] = useState(false);
    const [acertou, setAcertou] = useState(false);

    function verificarResposta() {
        setRespondido(true);
        if (respostaSelecionada === respostaCorreta) {
            setResultado("Resposta correta!");
            setAcertou(true);
        } else {
            setResultado("Resposta errada!");
            setAcertou(false);
        }
    }

    function refazer() {
        setRespostaSelecionada("");
        setResultado("");
        setRespondido(false);
        setAcertou(false);
    }

    function estiloBotao(opcao) {
        if (!respondido) {
            return respostaSelecionada === opcao ? Style.selecionado : "";
        }
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

            {respondido && acertou && (
                <button
                    className={Style.proximaPerguntaBtn}
                    onClick={onAcertar}
                >
                    {ultimaPergunta ? "Concluir exercícios" : "Próxima pergunta"}
                </button>
            )}

            {respondido && !acertou && (
                <button className={Style.refazerBtn} onClick={refazer}>
                    Refazer
                </button>
            )}
        </div>
    );
};

const ModeloBase = ({
    carregando,
    tituloAula,
    xpGanho,
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

    const [conteudo, setConteudo] = useState("artigo");
    const [perguntaAtual, setPerguntaAtual] = useState(0);
    const [exerciciosConcluidos, setExerciciosConcluidos] = useState(false);

    function trocarConteudo() {
        setConteudo(prev => prev === "artigo" ? "exercicio" : "artigo");
        setPerguntaAtual(0);
        setExerciciosConcluidos(false);
    }

    function avancarPergunta() {
        if (perguntaAtual < (perguntas?.length ?? 0) - 1) {
            setPerguntaAtual(prev => prev + 1);
        } else {
            setExerciciosConcluidos(true);
        }
    }

    const questaoAtual = perguntas?.[perguntaAtual];

    return (
        <>
            <div className={Style.corpo}>
                <div className={Style.separarConteudos}>
                    <div className={Style.parteCima}>
                        <h1>{tituloAula}</h1>
                        <p>+{xpGanho} XP ao concluir</p>
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
                    ) : exerciciosConcluidos ? (
                        <div className={Style.conclusao}>
                            <h1>Exercícios concluídos!</h1>
                            <p>Parabéns, você respondeu todas as perguntas corretamente.</p>
                            <button className={Style.refazerExerciciosbtn} onClick={() => {
                                setPerguntaAtual(0);
                                setExerciciosConcluidos(false);
                            }}>
                                Refazer exercícios
                            </button>
                        </div>
                    ) : questaoAtual ? (
                        <ModeloExecicios
                            key={perguntaAtual}
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
                            <button onClick={trocarConteudo} disabled={carregando}>
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