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
    numeroPergunta,
    respostaCorreta
}) => {

    const [respostaSelecionada, setRespostaSelecionada] = useState("");
    const [resultado, setResultado] = useState("");
    const [respondido, setRespondido] = useState(false);

    function verificarResposta() {
        setRespondido(true);
        if (respostaSelecionada === respostaCorreta) {
            setResultado("Resposta correta!");
        } else {
            setResultado("Resposta errada!");
        }
    }

    function estiloBotao(opcao) {
        if (!respondido) {
            return respostaSelecionada === opcao ? Style.selecionado : "";
        }
        if (opcao === respostaCorreta) return Style.correta;
        if (opcao === respostaSelecionada && opcao !== respostaCorreta) return Style.errada;
        return "";
    }

    return (
        <div className={Style.exercicio}>
            <p>{numeroPergunta} - {descPergunta}</p>

            <button className={estiloBotao(opcao1)} onClick={() => setRespostaSelecionada(opcao1)} disabled={respondido}>{opcao1}</button>
            <button className={estiloBotao(opcao2)} onClick={() => setRespostaSelecionada(opcao2)} disabled={respondido}>{opcao2}</button>
            <button className={estiloBotao(opcao3)} onClick={() => setRespostaSelecionada(opcao3)} disabled={respondido}>{opcao3}</button>
            <button className={estiloBotao(opcao4)} onClick={() => setRespostaSelecionada(opcao4)} disabled={respondido}>{opcao4}</button>

            {!respondido && (
                <button onClick={verificarResposta} disabled={!respostaSelecionada} className={Style.verificarRespostabtn}>
                    Verificar resposta
                </button>
            )}

            {resultado && <h2>{resultado}</h2>}
        </div>
    );
};

const ModeloBase = ({
    tituloAula,
    xpGanho,
    srcVideo,
    posterVideo,
    tipoMidia,
    proximaAula,
    aulaPassada,
    numeroPergunta,
    descPergunta,
    respostaCorreta,
    opcao1,
    opcao2,
    opcao3,
    opcao4,
    subtitulo1, paragrafo1,
    subtitulo2, paragrafo2,
    subtitulo3, paragrafo3,
    subtitulo4, paragrafo4,
    children
}) => {

    const [conteudo, setConteudo] = useState("artigo");

    function trocarConteudo() {
        setConteudo(prev => prev === "artigo" ? "exercicio" : "artigo");
    }

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
                    ) : (
                        <ModeloExecicios
                            numeroPergunta={numeroPergunta}
                            descPergunta={descPergunta}
                            respostaCorreta={respostaCorreta}
                            opcao1={opcao1}
                            opcao2={opcao2}
                            opcao3={opcao3}
                            opcao4={opcao4}
                        />
                    )}
                    <div className={Style.botoes}>
                        <div className={Style.butaozinho}>
                            <button onClick={trocarConteudo}>
                                {conteudo === "artigo" ? <p>exercicios</p> : <p>artigo</p>}
                            </button>
                        </div>
                        <Link to="/home" className={Style.butaozinho} id={Style.btnVoltar}>
                            <button>Voltar para Home</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export { ModeloBase };