import { Aula } from "../../../../../../funcoes/aula";
import { ModeloBase } from "../../modelo base";

<<<<<<< Updated upstream
const ComoFunciona = () => {  

    //Objeto da classe Aula

    const aula = new Aula();

    sincronizarAula();

    async function sincronizarAula() {
        
        // aula.SincronizarAula(6);
        
    }

    return (  // <- return explícito
        <ModeloBase
            tituloAula={"Como vai funcionar esse curso ?"}
            xpGanho={"50"}

            subtitulo1={"Introdução"}
            paragrafo1={"O MyCourse é um projeto educacional criado para ensinar de forma clara e progressiva. Este curso foi desenvolvido para levar você do nível iniciante até uma compreensão sólida sobre o funcionamento dos computadores e dispositivos eletrônicos. Nesta unidade inicial, o objetivo não é apenas apresentar peças, mas construir entendimento."}

            subtitulo2={"O que você aprenderá neste curso?"}
            paragrafo2={"O MyCourse não é um conteúdo para memorização rápida, mas um processo de construção gradual de conhecimento. Cada conceito serve de base para o próximo, desenvolvendo não apenas o como fazer, mas principalmente o por que fazer. O aprendizado técnico acontece com prática e revisão."}

            subtitulo3={"Evolução e base profissional"}
            paragrafo3={"Mesmo que as tecnologias mudem, os fundamentos permanecem. Ao dominar essa base, você estará preparado para aprender novas ferramentas, compreender especificações técnicas e evoluir na área. Este curso é o alicerce da sua formação."}

            numeroPergunta={"1"}
            descPergunta={"Qual é o objetivo principal do curso apresentado no MyCourse?"}
            respostaCorreta={"Ensinar os fundamentos de hardware de forma clara e proggressiva"}
            opcao1={"Ensinar apenas a montar computadores"}
            opcao2={"Ensinar apenas programação"}
            opcao3={"Ensinar os fundamentos de hardware de forma clara e proggressiva"}
            opcao4={"Ensinar somente manunteção avançada"}
        />
    );
};
=======
const ComoFunciona = () => (
    <ModeloBase
        tituloAula=""
        xpGanho={50}
        srcVideo=""
        posterVideo=""
        tipoMidia=""
        aulaPassada=""
        proximaAula=""

        subtitulo1=""
        paragrafo1=""
        subtitulo2=""
        subtitulo3=""
        paragrafo3=""
        subtitulo4=""
        paragrafo4=""

        perguntas={[
            {
                descPergunta: "",
                respostaCorreta: "",
                opcao1: "",
                opcao2: "",
                opcao3: "",
                opcao4: "",
                opcao5: "",
            },
            {
                descPergunta: "",
                respostaCorreta: "",
                opcao1: "",
                opcao2: "",
                opcao3: "",
                opcao4: "",
                opcao5: "",
            },
            {
                descPergunta: "",
                respostaCorreta: "",
                opcao1: "",
                opcao2: "",
                opcao3: "",
                opcao4: "",
                opcao5: "",
            },
            {
                descPergunta: "",
                respostaCorreta: "",
                opcao1: "",
                opcao2: "",
                opcao3: "",
                opcao4: "",
                opcao5: "",
            },
            {
                descPergunta: "",
                respostaCorreta: "",
                opcao1: "",
                opcao2: "",
                opcao3: "",
                opcao4: "",
                opcao5: "",
            },
        ]}
    />
);
>>>>>>> Stashed changes

export { ComoFunciona };