import { ModeloBase } from "../../modelo base";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Aula } from "../../../../../../funcoes/aula";
import videoIntroduçãoSoftware from "../../../../../fotos/videozinhoLegal.mp4";

const IntroducaoSoftware = () => {
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

    //Objeto que da classe "Aula"
    const aula = new Aula(token,refresh_token,Navegacao,set)

    const [carregando, setCarregando] = useState(true);
    const [perguntas, setPerguntas] = useState([]);

    //Pega os dados do usuario
    let usuario = JSON.parse(localStorage.getItem("dados"));
    const email = usuario.email;

  

    useEffect(() => {
        // Sincronizar Exercicio e Aula com Usuario
        const Sincronizar = async () => {
            try {
                //Requisições em paralelo
                 await Promise.all([
                    aula.SincronizarAula(5),      //Id da aula de hardware
                    aula.SincronizarExercicio(5,setCarregando),  //Id do exercicio de hardware
                    aula.buscar_exercicio(5,email)
                ])

                //Pego as  questoes:
                const questoes = JSON.parse(localStorage.getItem("questoes")) || [];

                const perguntasFormatadas = questoes.map((questao) => {

                    const respostaCorreta =
                        questao.alternativas.find(a => a.correta)?.texto || "";

                    return {
                        descPergunta: questao.pergunta,
                        respostaCorreta,

                        opcao1: questao.alternativas[0]?.texto || "",
                        opcao2: questao.alternativas[1]?.texto || "",
                        opcao3: questao.alternativas[2]?.texto || "",
                        opcao4: questao.alternativas[3]?.texto || "",
                        opcao5: questao.alternativas[4]?.texto || "",
                    };
            });


                setPerguntas(perguntasFormatadas)


            } catch (erro) {
                console.error("Erro ao Sincronizar Matéria:", erro);
            } 
        };

        Sincronizar();
    }, []);

    return(
        <ModeloBase
            carregando={carregando}
            idExercicio={5}
            idConquista={20}
            tituloAula="Introdução Software"
            xpGanho={50}
            srcVideo={videoIntroduçãoSoftware}
            posterVideo=""
            tipoMidia=""
            aulaPassada=""
            proximaAula=""

            subtitulo1="1. Por que aprender tecnologia importa?"
            paragrafo1="Primeiro é necessário entender a importância da tecnologia e o que ela representa para nós seres humanos e seu apoio na sociedade , a origem da palavra tecnologia vem do grego onde techne representa a arte, técnica ou ofício e logos significa estudo ou conjunto de saberes. 
            A tecnologia sempre traz como proposta suprir as necessidades humanas, aumentar a produtividade e expandir o potencial de realização de tarefas, sempre se aprimorando para ser o conjunto de ferramentas e técnicas mais atual como método eficiente para resolução e otimização de problemas
            O aprendizado contínuo é o motor do desenvolvimento pessoal e profissional, especialmente no setor de tecnologia, que se transformam a cada dia. Hoje, o mercado não exige apenas o domínio técnico de códigos ou componentes, mas também uma alta capacidade de adaptação.
            Nesse cenário, para quem está dando os primeiros passos rumo ao desconhecido, a motivação e a mentalidade de crescimento são os pilares para o sucesso. A motivação alimenta a persistência diante de conceitos que parecem complexos à primeira vista, principalmente quando o estudante entende e percebe a aplicação prática do que está aprendendo. Já a mentalidade de crescimento transforma a curiosidade e a disciplina em hábitos diários, preparando o futuro profissional desde a sua primeira linha de código ou conceitos de hardware.
            "

            subtitulo2="2. Desafios"
            paragrafo2="
            Apesar da alta demanda e das oportunidades na área de tecnologia, o caminho para os estudantes iniciantes apresenta barreiras significativas que costumam intimidar quem não possui conhecimento prévio.

            Um dos principais desafios está nas abordagens ultrapassadas. O ensino tradicional frequentemente utiliza métodos excessivamente teóricos e pouco adaptados para iniciantes, dificultando a assimilação dos conceitos fundamentais.

            Outro problema é a complexidade técnica e a falta de didática. Grande parte do conteúdo disponível sobre software e hardware utiliza muitos termos técnicos logo no início, o que pode afastar novos estudantes.

            Além disso, existe o estigma de que a tecnologia é uma área destinada apenas para pessoas extremamente inteligentes ou com grande facilidade em matemática. Essa visão acaba desencorajando muitas pessoas interessadas em aprender.
            "

            subtitulo3="3. Ponte para o conhecimento"
            paragrafo3="
            A tecnologia, aliada ao design educacional e à gamificação, torna o aprendizado mais acessível, interativo e motivador.

            Plataformas digitais permitem dividir conteúdos complexos em pequenas etapas, facilitando a compreensão gradual dos conceitos de software e hardware.

            Elementos inspirados em jogos, como pontos, conquistas e níveis de progressão, aumentam o engajamento dos estudantes e ajudam na manutenção da disciplina.

            Além disso, ambientes gamificados transformam o erro em uma oportunidade de aprendizado, reduzindo a frustração e incentivando a persistência durante os estudos.
            "
            
            subtitulo4="4. Conclusão"
            paragrafo4="Romper as barreiras do ensino técnico exige humanizar a tecnologia compreendendo as dificuldades e a melhor forma de aprendizagem, exigindo repensar as ferramentas que utilizamos para ensiná-la. Ao unir a tecnologia educacional e a gamificação à introdução de Software e Hardware, transformamos o aprendizado de uma obrigatoriedade complexa em uma experiência lúdica, receptiva e altamente acessível.) Assim, ao acolher quem está começando do zero, a tecnologia cumpre seu papel mais nobre: o de instrumento de inclusão e transformação social, abrindo as portas do futuro para todos.
            "

           perguntas={perguntas}
        />
        )
    };

export { IntroducaoSoftware };