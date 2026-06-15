import { ModeloBase } from "../../modelo base";

import { useEffect } from "react";

const MotivacaoMentalidade = () => {
    return(
    <ModeloBase
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

        perguntas={[
            {
                descPergunta: "1. Qual é a principal função do hardware em um sistema computacional?",
                respostaCorreta: "B) Processar, armazenar e transmitir informações, sendo a base física sobre a qual o software opera.",
                opcao1: "A) Criar interfaces gráficas e sistemas operacionais para o usuário.",
                opcao2: "B) Processar, armazenar e transmitir informações, sendo a base física sobre a qual o software opera.",
                opcao3: "C) Desenvolver algoritmos e linguagens de programação de alto nível.",
                opcao4: "D) Garantir a segurança digital e proteger dados contra vírus e malwares.",
                opcao5: "E) Substituir o papel do sistema operacional em dispositivos modernos.",
            },
            {
                descPergunta: "2. O que diferencia um SSD de um HD no contexto do armazenamento de dados?",
                respostaCorreta: "D) O SSD utiliza chips de memória flash, sendo mais rápido, silencioso e resistente a impactos do que o HD.",
                opcao1: "A) O SSD armazena mais dados, mas consome muito mais energia do que o HD.",
                opcao2: "B) O HD é mais moderno e utiliza tecnologia de chips de memória flash.",
                opcao3: "C) O SSD utiliza discos magnéticos giratórios, enquanto o HD usa chips de memória flash.",
                opcao4: "D) O SSD utiliza chips de memória flash, sendo mais rápido, silencioso e resistente a impactos do que o HD.",
                opcao5: "E) Ambos funcionam da mesma forma, diferindo apenas no tamanho físico do componente.",
            },
            {
                descPergunta: "3. Qual componente do computador é responsável por conectar e garantir a comunicação entre todos os outros?",
                respostaCorreta: "E) A placa-mãe, que funciona como o sistema nervoso central conectando CPU, RAM, armazenamento e periféricos.",
                opcao1: "A) A memória RAM, por ter acesso aleatório a todos os dados do sistema.",
                opcao2: "B) A CPU, por ser o elemento central que gerencia todo o fluxo de informações.",
                opcao3: "C) A fonte de alimentação, por distribuir energia a cada componente do sistema.",
                opcao4: "D) O SSD, por ser o componente mais rápido e ter acesso direto à CPU.",
                opcao5: "E) A placa-mãe, que funciona como o sistema nervoso central conectando CPU, RAM, armazenamento e periféricos.",
            },
            {
                descPergunta: "4. Por que o conhecimento de hardware é importante mesmo para profissionais que trabalham com software?",
                respostaCorreta: "B) Porque entender os componentes físicos permite tomar decisões mais inteligentes, diagnosticar problemas e construir soluções mais eficientes.",
                opcao1: "A) Porque programadores são obrigados por lei a montar seus próprios computadores.",
                opcao2: "B) Porque entender os componentes físicos permite tomar decisões mais inteligentes, diagnosticar problemas e construir soluções mais eficientes.",
                opcao3: "C) Porque o hardware será substituído pelo software em breve, tornando esse conhecimento temporário.",
                opcao4: "D) Porque sem conhecimento de hardware é impossível aprender qualquer linguagem de programação.",
                opcao5: "E) Porque o mercado exige que todos os profissionais de tecnologia sejam técnicos em eletrônica.",
            },
            {
                descPergunta: "5. De acordo com o texto, em quais áreas além dos computadores tradicionais o hardware está presente?",
                respostaCorreta: "C) Em smartphones, servidores em nuvem, veículos autônomos, equipamentos médicos e dispositivos IoT.",
                opcao1: "A) Apenas em servidores corporativos de grande porte e data centers.",
                opcao2: "B) Somente em dispositivos móveis como smartphones e tablets.",
                opcao3: "C) Em smartphones, servidores em nuvem, veículos autônomos, equipamentos médicos e dispositivos IoT.",
                opcao4: "D) Apenas em equipamentos industriais e sistemas de automação de fábricas.",
                opcao5: "E) Exclusivamente em dispositivos conectados à internet de alta velocidade.",
            },
        ]}
    />
    )
};



export { MotivacaoMentalidade };