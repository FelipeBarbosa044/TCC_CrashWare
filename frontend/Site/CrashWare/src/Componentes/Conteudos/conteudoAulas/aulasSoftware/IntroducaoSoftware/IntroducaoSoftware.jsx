import { ModeloBase } from "../../modelo base";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Aula } from "../../../../../../funcoes/aula";

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
            srcVideo=""
            posterVideo=""
            tipoMidia=""
            aulaPassada=""
            proximaAula=""

            subtitulo1="1. Por que aprender tecnologia importa?"
            paragrafo1="Primeiro é necessário entender a importância [pensamento] da tecnologia e o que ela representa para nós seres humanos e seu apoio na sociedade [grupo], a origem da palavra tecnologia vem do grego [pilar grecia] onde techne representa a arte, técnica ou ofício e logos significa estudo ou conjunto de saberes. 
            A tecnologia sempre traz como proposta suprir as necessidades humanas[1], aumentar a produtividade[2] e expandir o potencial de realização de tarefas[3], sempre se aprimorando para ser o conjunto de ferramentas e técnicas mais atual como método eficiente para resolução e otimização de problemas
            O aprendizado contínuo é o motor do desenvolvimento pessoal e profissional[1], especialmente no setor de tecnologia[2], que se transformam a cada dia. Hoje, o mercado não exige apenas o domínio técnico de códigos[4] ou componentes[5], mas também uma alta capacidade de adaptação[6].
            Nesse cenário, para quem está dando os primeiros passos rumo ao desconhecido[1 caminho], a motivação e a mentalidade de crescimento[2] são os pilares[3] para o sucesso. A motivação[4 pilar] alimenta a persistência diante de conceitos que parecem complexos à primeira vista, principalmente quando o estudante entende e percebe a aplicação prática do que está aprendendo. Já a mentalidade[5 pilar] de crescimento transforma a curiosidade e a disciplina em hábitos diários, preparando o futuro profissional desde a sua primeira linha de código ou conceitos de hardware.[6]
            "

            subtitulo2="2. Desafios"
            paragrafo2="Apesar da alta demanda e das oportunidades[1] na área de tecnologia, o caminho para os estudantes iniciantes apresenta barreiras[2] significativas por diversos motivos, o que costumam intimidar[3] quem não tem nenhum conhecimento prévio. As principais são:
            •	Abordagens ultrapassadas: O ensino tradicional foca em métodos excessivamente teóricos, densos e engessados[1]. Ignora-se que quem nunca teve contato com a área e precisa de uma transição suave e receptiva, respeitando o ritmo de aprendizado individual.
            •	Complexidade técnica e falta de didática: Grande parte do conteúdo disponível sobre desenvolvimento de software e infraestrutura de hardware carece de estrutura e objetividade[1]. A presença de jargões técnicos [2]excessivos logo no início assusta e afasta potenciais novos talentos. [3]
            •	O estigma da área: Existe uma percepção cultural de que trabalhar com tecnologia é apenas para mentes matemáticas ou prodígios[1.2], o que cria uma exclusão psicológica e social, desencorajando pessoas interessadas que acreditam não ter o perfil para a área.
            "

            subtitulo3="A tecnologia, junto ao design educacional e à gamificação[1], torna o aprendizado mais acessível, interativo e motivador,[2] surgindo como a principal ferramenta para solucionar essas falhas e democratizar o acesso ao ecossistema digital. Essa abordagem atua em três frentes essenciais:
            •	Aprendizado acessível: Plataformas digitais interativas rompem barreiras, permitindo que conceitos complexos de hardware e software sejam fragmentados em lições curtas[] e diárias[] dividindo e simplificando alguns conteúdos densos. O conteúdo se ajusta ao desempenho do usuário, garantindo uma introdução sem sobrecarga cognitiva.
            •	Cativação: Recursos inspirados em jogos como sistemas de pontos[], conquistas[], fases e trilhas de progresso visuais transformam o estudo em uma atividade leve e estimulante, ajudando a manter a consistência a longo prazo do usuário.
            •	Ambiente acolhedor: O ecossistema gamificado oferece um espaço seguro onde o erro não é uma punição, mas uma mecânica de aprendizado. Ao errar um desafio de lógica ou a montagem virtual de um componente, o usuário perde vidas ou recebe dicas imediatas, reduzindo a frustração e o medo comuns em salas de aula tradicionais.
            "
            subtitulo4="4. Conclusão"
            paragrafo4="Romper as barreiras do ensino técnico exige humanizar a tecnologia compreendendo as dificuldades e a melhor forma de aprendizagem, exigindo repensar as ferramentas que utilizamos para ensiná-la. Ao unir a tecnologia educacional e a gamificação à introdução de Software e Hardware, transformamos o aprendizado de uma obrigatoriedade complexa em uma experiência lúdica, receptiva e altamente acessível.) Assim, ao acolher quem está começando do zero, a tecnologia cumpre seu papel mais nobre: o de instrumento de inclusão e transformação social, abrindo as portas do futuro para todos.
            "

           perguntas={perguntas}
        />
        )
    };

export { IntroducaoSoftware };