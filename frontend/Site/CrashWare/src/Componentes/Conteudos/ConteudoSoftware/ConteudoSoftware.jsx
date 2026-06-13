import Style from "./ConteudoSoftware.module.css";

import softwareIcon from "../../../fotos/software.svg";
import certoIcon from "../../../fotos/certo.svg";
import playIcon from "../../../fotos/play.svg";
import htmlIcon from "../../../fotos/html.svg";
import cssIcon from "../../../fotos/css.svg";


import { PopUp } from "../../pop-up";


import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { Aula } from "../../../../funcoes/aula";

const conteudoSoftware_Introducao = [
    { descricao: "Introdução à Tecnologia", to: "" },
    { descricao: "Como vai funcionar esse curso?", to: "" },
];

const conteudoSoftware_LogicaProgramacao = [
    { descricao: "O que é Lógica de Programação", to: "" },
    { descricao: "Algoritmos e Fluxo de Execução", to: "" },
    { descricao: "Variáveis e Tipos de Dados", to: "" },
    { descricao: "Operadores (Aritméticos e Lógicos)", to: "" },
    { descricao: "Estruturas Condicionais", to: "" },
    { descricao: "Estruturas de Repetição", to: "" },
    { descricao: "Funções", to: "" },
    { descricao: "Abstração de Problemas", to: "" },
];

const conteudoSoftware_WebDev = [
    { descricao: "Introdução ao HTML e CSS", to: "" },
    { descricao: "Estilização de páginas web", to: "" },
    { descricao: "JavaScript básico", to: "" },
    { descricao: "Manipulação do DOM", to: "" },
    { descricao: "Introdução ao React", to: "" },
];

const totalAulas =
    conteudoSoftware_Introducao.length +
    conteudoSoftware_LogicaProgramacao.length +
    conteudoSoftware_WebDev.length;

const Item_ConteudoSoftware = ({
    descricao,
    to,
    onMarcarFeito
}) => {

    const [jaFez, setJaFez] = useState(() => {
        const salvo = localStorage.getItem(
            `software-${descricao}`
        );

        return salvo === "true";
    });

    function alternarStatus() {

        const novoStatus = !jaFez;

        setJaFez(novoStatus);

        localStorage.setItem(
            `software-${descricao}`,
            JSON.stringify(novoStatus)
        );

        onMarcarFeito(novoStatus);
    }

    return (
        <div className={Style.item}>
            <img
                onClick={alternarStatus}
                src={jaFez ? certoIcon : playIcon}
                alt="você já fez?"
            />

            <Link to={to}>
                <p>{descricao}</p>
            </Link>
        </div>
    );
};

const ConteudoSoftware = () => {

    //Objeto que contém a classe "Aula"
    const aula = new Aula();

    //Popup
    const [popup, setPopup] = useState(null);

    const [quantidadeFeita, setQuantidadeFeita] =
        useState(() => {

            const progressoSalvo =
                localStorage.getItem(
                    "progressoSoftware"
                );

            return progressoSalvo
                ? Number(progressoSalvo)
                : 0;
        });

    function marcarFeito(jaFez) {

        let novoValor;

        if (jaFez) {
            novoValor = quantidadeFeita + 1;
        } else {
            novoValor = quantidadeFeita - 1;
        }

        setQuantidadeFeita(novoValor);

        localStorage.setItem(
            "progressoSoftware",
            novoValor
        );
    }

    async function BuscarAulas() {
        setPopup({
                tipo: 'aviso',
                titulo: 'Aulas',
                mensagem: 'Buscando suas Aulas...'
            });

        //Busco as anotações
        const aulas = await aula.buscar_software();


    }
    //Busco as aulas sempre que a pag for carregada
    useEffect(() => {

        BuscarAulas();

    }, [])

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
            <main className={Style.corpo}>

                <section className={Style.apresentacao}>

                    <div className={Style.parte1}>

                        <div className={Style.titulo}>
                            <img
                                src={softwareIcon}
                                alt="Icone de software"
                            />

                            <div>
                                <h1>SOFTWARE</h1>

                                <h2>
                                    Aprenda e domine as linguagens da era digital
                                </h2>
                            </div>
                        </div>

                        <p>
                            Este percurso apresenta os
                            <span>
                                {" "}fundamentos do software e do desenvolvimento de sistemas.
                            </span>

                            Durante os módulos, você aprenderá sobre lógica de programação,
                            algoritmos, estruturas de dados e desenvolvimento web.

                            Ao longo do curso, entenderá como os programas funcionam,
                            como escrever código limpo e os conceitos essenciais da
                            engenharia de software.
                        </p>

                        <div className={Style.progressoCursoSoftware}>

                            <p>
                                Progresso: {quantidadeFeita}/{totalAulas}
                            </p>

                            <progress
                                value={quantidadeFeita}
                                max={totalAulas}
                            />

                        </div>

                    </div>

                    <div className={Style.parte2}>

                        <div className={Style.html_css}>
                            <img
                                src={htmlIcon}
                                alt="HTML logo"
                            />

                            <img
                                src={cssIcon}
                                alt="CSS logo"
                            />
                        </div>

                        <hr />

                        <p>
                            Novos conteúdos de HTML, CSS e JavaScript estão chegando.
                            Neles, você aprenderá a criar interfaces web modernas e a
                            desenvolver aplicações interativas do zero.
                        </p>

                    </div>

                </section>

                <section className={Style.conteudos}>

                    <div className={Style.introducao}>

                        <h1>1 - Introdução</h1>
                        <hr />

                        {conteudoSoftware_Introducao.map((item, index) => (
                            <Item_ConteudoSoftware
                                key={index}
                                descricao={item.descricao}
                                to={item.to}
                                onMarcarFeito={marcarFeito}
                            />
                        ))}

                    </div>

                    <div className={Style.fundamentos}>

                        <h1>2 - Lógica de Programação</h1>
                        <hr />

                        {conteudoSoftware_LogicaProgramacao.map((item, index) => (
                            <Item_ConteudoSoftware
                                key={index}
                                descricao={item.descricao}
                                to={item.to}
                                onMarcarFeito={marcarFeito}
                            />
                        ))}

                    </div>

                    <div className={Style.componentes}>

                        <h1>3 - Desenvolvimento Web</h1>
                        <hr />

                        {conteudoSoftware_WebDev.map((item, index) => (
                            <Item_ConteudoSoftware
                                key={index}
                                descricao={item.descricao}
                                to={item.to}
                                onMarcarFeito={marcarFeito}
                            />
                        ))}

                    </div>

                </section>

            </main>
        </>
    );
};

export { ConteudoSoftware };