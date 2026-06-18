
import Style from "./modeloBase.module.css";

import { Link } from "react-router-dom";

import { useState , useEffect, use } from "react";

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



    //Objeto da Classe Aula

    const aula = new Aula(token,refresh_token,Navegacao,set);



    //Pega os dados do usuario

    let usuario = JSON.parse(localStorage.getItem("dados"));

    const email = usuario.email;





    async function verificarResposta() {

        setRespondido(true);



        let acertou = null;



        if (respostaSelecionada === respostaCorreta) {

            setResultado("Resposta CORRETA!");

            acertou = true;

            setAcertou(true);

            

        } else {

            setResultado("Resposta ERRADA!");

            acertou = false;

            setAcertou(false);

        }



        //Atualizo o exercicio
        aula.progredir_exercicio(idExercicio,acertou,email);

    }



    // function refazer() {

    //     setRespostaSelecionada("");

    //     setResultado("");

    //     setRespondido(false);

    //     setAcertou(false);

    // }



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



            {respondido && (

                <button

                    className={Style.proximaPerguntaBtn}

                    onClick={onAcertar}

                >

                    {ultimaPergunta ? "Concluir exercícios" : "Próxima pergunta"}

                </button>

            )}

{/* 

            {respondido && !acertou && (

                <button className={Style.refazerBtn} onClick={refazer}>

                    Refazer

                </button>

            )} */}

        </div>

    );

};



const ModeloBase = ({

    carregando,

    idConquista,

    idExercicio,

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



    const [conteudo, setConteudo] = useState("artigo");

    const [perguntaAtual, setPerguntaAtual] = useState(0);



    //PopupConquista

    const [popupConquista, setPopupConquista] = useState(null);

     //Popup

    const [popup, setPopup] = useState(null);



    //Pega os dados do usuario

    let usuario = JSON.parse(localStorage.getItem("dados"));

    const email = usuario.email;



    useEffect(() => {


        //Quando componente for carregado

        const questaoAtual =

        Number(localStorage.getItem("questao_atual")) - 1;


        const totalPerguntas = perguntas?.length ?? 0;


        if (questaoAtual > totalPerguntas && totalPerguntas > 0) {



            setExerciciosConcluidos(true);

        }else

        {

            setPerguntaAtual(questaoAtual);

        }



    }, [carregando]);





    const [exerciciosConcluidos, setExerciciosConcluidos] = useState(false);

    const [carregandoConquista, setCarregandoConquista] = useState(false);



    //Objeto da Classe Aula

    const aula = new Aula(token,refresh_token,Navegacao,set);



    //Objeto da Classe User

    const user = new Usuario(token, refresh_token, Navegacao, set);



    function trocarConteudo() {



        const questaoAtualBanco =

            Number(localStorage.getItem("questao_atual"));



        const totalPerguntas =

            perguntas?.length ?? 0;



        if (

            conteudo === "artigo" &&

            questaoAtualBanco > totalPerguntas

        ) {

            setExerciciosConcluidos(true);

        }



        setConteudo(prev =>

            prev === "artigo"

                ? "exercicio"

                : "artigo"

        );

    }



    function avancarPergunta() {

        if (perguntaAtual < (perguntas?.length ?? 0) - 1) {

            setPerguntaAtual(prev => prev + 1);

        } else {

            setExerciciosConcluidos(true);

        }

    }   



    async function ConcluirAula() {

        //



         setPopup({

                    tipo: 'aviso',

                    titulo: 'Aula',

                    mensagem: 'Finalizando Aula...'

                });

        //Dou a recompensa da aula pro usuario

        await user.adicionar_moeda(20,setDados)

        await user.adicionar_xp(1000,setDados)


        //Acabo a aula

        await aula.acabar_aula(idExercicio,email,Navegacao)



    }



    useEffect(() => {

        //Só aparece quando terminar todas as aulas

        if (exerciciosConcluidos) {

            setCarregandoConquista(true);



            (async () => {

                await Promise.all([

                    await user.conquista(idConquista, setPopupConquista, setDados)

                ]);

                setCarregandoConquista(false);

            })();

    }

    }, [exerciciosConcluidos]);







    const questaoAtual = perguntas?.[perguntaAtual];


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

                        <p>+1000 XP ao concluir</p>

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

                            <button

                                className={Style.proximaPerguntaBtn}

                                disabled={carregandoConquista}

                                onClick={ConcluirAula}

                            >

                                Concluir Aula

                            </button>

                        </div>

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





