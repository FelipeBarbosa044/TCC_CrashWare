import { ModeloBase } from "../../modelo base";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";

import { useEffect } from "react";

const MotivacaoMentalidade = () => {

    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <ModeloBase 
            tituloAula={"Motivação e Mentalidade"}
            xpGanho={"50"}

            numeroPergunta={"1"}

            descPergunta={
                "Qual é a mentalidade mais importante para evoluir na área de hardware?"
            }

            respostaCorreta={
                "Ter constância nos estudos e aprender os fundamentos"
            }

            opcao1={"Aprender apenas montagem rápida"}
            opcao2={"Ter constância nos estudos e aprender os fundamentos"}
            opcao3={"Memorizar nomes de peças"}
            opcao4={"Trocar peças sem entender o problema"}

            children={
                <>
                    <h2>Por que aprender hardware?</h2>

                    <p>
                        A área de hardware vai muito além de montar computadores.
                    </p>

                    <h2>Exemplo de código JavaScript</h2>

                    <pre>
                        <code className="language-javascript">
{`function estudarHardware() {
    console.log("Aprendendo hardware todos os dias!");
}

estudarHardware();`}
                        </code>
                    </pre>

                    <h2>Continue praticando</h2>

                    <p>
                        Quanto mais você pratica, mais fácil fica entender tecnologia.
                    </p>
                </>
            }
        />
    );
};

export { MotivacaoMentalidade };