import { Aula } from "../../../../../../funcoes/aula";
import { ModeloBase } from "../../modelo base";
import { useNavigate } from "react-router-dom";
import { useEffect , useState} from "react";
import  videoIntroducaoHardware  from "../../../../../fotos/videozinhoLegal.mp4";

const IntroducaoHardware = () => {

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
                    aula.SincronizarAula(7),      //Id da aula de hardware
                    aula.SincronizarExercicio(7,setCarregando),  //Id do exercicio de hardware
                    aula.buscar_exercicio(7,email)
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
                console.error("Erro ao Sincronizar Matéria", erro);
            }
        };

        Sincronizar();
    }, []);



    return(
    <ModeloBase
        carregando={carregando}
        idExercicio={7}
        idConquista={19}
        tituloAula="Introdução Hardware"
        xpGanho={50}
        srcVideo={videoIntroducaoHardware}
        posterVideo=""
        tipoMidia=""
        aulaPassada=""
        proximaAula=""

        subtitulo1="1. O que é Hardware e por que ele importa?"
        paragrafo1="Para entender o mundo digital, é necessário compreender sua base física: o hardware. A palavra vem do inglês e pode ser traduzida como parte dura referindo-se a todos os componentes físicos e tangíveis que compõem um sistema computacional, desde o processador até os cabos de conexão.
        O hardware tem como função central processar, armazenar e transmitir informações, sendo o alicerce sobre o qual qualquer software opera. Sem ele, programas, sistemas operacionais e aplicativos simplesmente não existiriam. É o hardware que transforma a energia elétrica em dados, e dados em resultados que utilizamos no nosso cotidiano.
        Compreender o hardware não é exclusividade de engenheiros ou técnicos especializados. Para qualquer profissional da área de tecnologia seja desenvolvedor, analista ou suporte entender como os componentes físicos funcionam e se comunicam é essencial para tomar decisões mais inteligentes, diagnosticar problemas e construir soluções mais eficientes.
        Nessa jornada de aprendizado, saber por que cada peça existe é tão importante quanto saber como ela funciona. Conhecer a função de um processador, entender o papel da memória RAM ou reconhecer a diferença entre um SSD e um HD transforma o aprendiz em um profissional mais completo e confiante diante dos desafios tecnológicos.
"
        subtitulo2="2. Componentes Fundamentais"
        paragrafo2="Um computador é composto por diversos componentes que trabalham em conjunto para garantir o funcionamento do sistema. Cada peça possui uma função específica e desempenha um papel essencial no processamento das informações.

        A CPU, também conhecida como Unidade Central de Processamento, é considerada o cérebro do computador. Ela é responsável por executar instruções, realizar cálculos e processar dados. Seu desempenho influencia diretamente a velocidade e a capacidade de resposta do sistema.

        A memória RAM funciona como uma memória temporária de alta velocidade. Ela armazena os dados e programas que estão sendo utilizados naquele momento, permitindo que o computador acesse essas informações rapidamente. Quanto maior a quantidade de memória RAM disponível, mais tarefas podem ser executadas simultaneamente sem comprometer o desempenho.

        O armazenamento é responsável por guardar dados de forma permanente. Atualmente, os dois principais tipos são o HD e o SSD. O HD utiliza discos magnéticos para armazenar informações, enquanto o SSD utiliza memória flash. Por não possuir partes móveis, o SSD oferece maior velocidade, menor consumo de energia e maior resistência física.

        A placa-mãe é o componente que conecta todos os demais dispositivos do computador. Ela funciona como uma central de comunicação, permitindo que processador, memória, armazenamento e periféricos troquem informações de forma organizada e eficiente.

        Já a fonte de alimentação tem a função de converter a energia elétrica da tomada em tensões adequadas para cada componente do sistema. Além de fornecer energia, uma fonte de qualidade contribui para a estabilidade e proteção dos equipamentos, evitando danos causados por oscilações elétricas."
        
        subtitulo3="3. Hardware no mundo real"
        paragrafo3="O hardware não está presente apenas em computadores desktop ou notebooks. Ele permeia praticamente todos os aspectos da vida moderna: está nos smartphones, nos servidores em nuvem, nos veículos autônomos, nos equipamentos médicos e até nos eletrodomésticos inteligentes conectados à internet das coisas (IoT).
        Cada avanço tecnológico que utilizamos no dia a dia é sustentado por uma evolução contínua do hardware. A miniaturização dos processadores, o aumento da capacidade de armazenamento e a velocidade crescente das memórias são conquistas que transformaram o mundo nas últimas décadas e continuam transformando.
        Compreender essa evolução ajuda a entender para onde a tecnologia está indo. Conceitos como computação quântica, processadores de múltiplos núcleos e memórias de nova geração já são realidade no mercado e exigem profissionais preparados para lidar com esse cenário em constante transformação.
        "
        subtitulo4="4. Conclusão"
        paragrafo4="Dominar os fundamentos do hardware é o primeiro passo para qualquer carreira sólida em tecnologia. Conhecer os componentes, entender suas funções e compreender como se comunicam entre si forma a base sobre a qual todo o conhecimento técnico é construído. Mais do que decorar nomes e especificações, o objetivo é desenvolver um raciocínio técnico que permita analisar, comparar e escolher as melhores soluções para cada situação.
        Ao longo deste curso, cada conceito será apresentado de forma progressiva, conectando a teoria à prática. O hardware deixará de ser uma sequência de termos desconhecidos e se tornará uma linguagem familiar a linguagem das máquinas que movem o mundo digital. Este é o seu ponto de partida para uma jornada de aprendizado contínuo, onde cada peça compreendida é um passo a mais em direção à excelência profissional.
        "

        perguntas={perguntas}
    />
    )
};



export { IntroducaoHardware };