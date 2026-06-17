import { Aula } from "../../../../../../funcoes/aula";
import { ModeloBase } from "../../modelo base";
import { useNavigate } from "react-router-dom";
import { useEffect , useState} from "react";


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
        srcVideo=""
        posterVideo=""
        tipoMidia=""
        aulaPassada=""
        proximaAula=""

        subtitulo1="1. O que é Hardware e por que ele importa?"
        paragrafo1="Para entender o mundo digital, é necessário compreender sua base física: o hardware. A palavra vem do inglês e pode ser traduzida como parte dura — referindo-se a todos os componentes físicos e tangíveis que compõem um sistema computacional, desde o processador até os cabos de conexão.
        O hardware tem como função central processar, armazenar e transmitir informações, sendo o alicerce sobre o qual qualquer software opera. Sem ele, programas, sistemas operacionais e aplicativos simplesmente não existiriam. É o hardware que transforma a energia elétrica em dados, e dados em resultados que utilizamos no nosso cotidiano.
        Compreender o hardware não é exclusividade de engenheiros ou técnicos especializados. Para qualquer profissional da área de tecnologia — seja desenvolvedor, analista ou suporte — entender como os componentes físicos funcionam e se comunicam é essencial para tomar decisões mais inteligentes, diagnosticar problemas e construir soluções mais eficientes.
        Nessa jornada de aprendizado, saber por que cada peça existe é tão importante quanto saber como ela funciona. Conhecer a função de um processador, entender o papel da memória RAM ou reconhecer a diferença entre um SSD e um HD transforma o aprendiz em um profissional mais completo e confiante diante dos desafios tecnológicos.
"
        subtitulo2="2. Componentes Fundamentais"
        paragrafo2="Um computador é composto por diversos componentes que trabalham em conjunto de forma harmônica. Cada um possui uma função específica e insubstituível dentro do sistema. Os principais são:
        •	CPU (Unidade Central de Processamento): Conhecida como o cérebro do computador, é responsável por executar instruções e processar dados. Sua velocidade é medida em GHz e seu desempenho impacta diretamente na agilidade do sistema.
        •	Memória RAM (Random Access Memory): É a memória de curto prazo do computador. Armazena temporariamente os dados dos programas em execução. Quanto maior a RAM, mais tarefas o sistema consegue executar simultaneamente sem lentidão.
        •	Armazenamento (HD e SSD): Guardam dados de forma permanente. O HD usa discos magnéticos giratórios, enquanto o SSD utiliza chips de memória flash, sendo muito mais rápido, silencioso e resistente a impactos.
        •	Placa-mãe (Motherboard): É o componente que conecta todos os outros. Funciona como o sistema nervoso central do computador, garantindo a comunicação entre CPU, RAM, armazenamento e periféricos.
        •	Fonte de Alimentação (PSU): Converte a energia elétrica da tomada em tensões adequadas para cada componente do sistema. Uma fonte de qualidade garante estabilidade e protege os demais componentes.
        "
        subtitulo3="3. Hardware no mundo real"
        paragrafo3="O hardware não está presente apenas em computadores desktop ou notebooks. Ele permeia praticamente todos os aspectos da vida moderna: está nos smartphones, nos servidores em nuvem, nos veículos autônomos, nos equipamentos médicos e até nos eletrodomésticos inteligentes conectados à internet das coisas (IoT).
        Cada avanço tecnológico que utilizamos no dia a dia é sustentado por uma evolução contínua do hardware. A miniaturização dos processadores, o aumento da capacidade de armazenamento e a velocidade crescente das memórias são conquistas que transformaram o mundo nas últimas décadas — e continuam transformando.
        Compreender essa evolução ajuda a entender para onde a tecnologia está indo. Conceitos como computação quântica, processadores de múltiplos núcleos e memórias de nova geração já são realidade no mercado e exigem profissionais preparados para lidar com esse cenário em constante transformação.
        "
        subtitulo4="4. Conclusão"
        paragrafo4="Dominar os fundamentos do hardware é o primeiro passo para qualquer carreira sólida em tecnologia. Conhecer os componentes, entender suas funções e compreender como se comunicam entre si forma a base sobre a qual todo o conhecimento técnico é construído. Mais do que decorar nomes e especificações, o objetivo é desenvolver um raciocínio técnico que permita analisar, comparar e escolher as melhores soluções para cada situação.
        Ao longo deste curso, cada conceito será apresentado de forma progressiva, conectando a teoria à prática. O hardware deixará de ser uma sequência de termos desconhecidos e se tornará uma linguagem familiar — a linguagem das máquinas que movem o mundo digital. Este é o seu ponto de partida para uma jornada de aprendizado contínuo, onde cada peça compreendida é um passo a mais em direção à excelência profissional.
        "

        perguntas={perguntas}
    />
    )
};



export { IntroducaoHardware };