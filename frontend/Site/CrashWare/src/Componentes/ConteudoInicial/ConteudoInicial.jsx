import FMenina from '../../fotos/menina_estudando.png'
import { Botoes } from '../Botoes/Botoes'
import { Cards } from '../Cards/Cards'
import Style from './ConteudoInicial.module.css'

const ConteudoInicial = () =>
{
    return (
        <>

            <div className={Style.Conteudo}> {/*Parte de cima*/}
                <h3>Aprenda <span>Hardware</span> e <span>Software</span> de forma prática e envolvente</h3>
                <div className={Style.Conteudo_img}>


                    <img src={FMenina} alt="" /> {/*Foto da parte de cima*/}
                </div>
            </div>
            <main>
            <div> {/*Cards /// coloquei a div só por separação mesmo*/}
                <Cards />
            </div>

            <div className={Style.Textos}>
                <h2>Hardware</h2>
                <hr />

                <h4>Componentes do Computador</h4>
                <p>Entenda como funcionam CPU, RAM, SSD, placa-mãe e placa de vídeo e como cada peça influencia no desempenho.</p>
                <hr />

                <h4>Montagem e Upgrade</h4>
                <p>Aprenda a montar um computador do zero, substituir peças e melhorar a performance com upgrades estratégicos.</p>
                <hr />

                <h4>Manutenção e Diagnóstico</h4>
                <p>Identifique problemas, faça limpeza correta e resolva falhas comuns de hardware.</p>
                <hr />

                <br />

                <h2>Software</h2>
                <hr />

                <h4>Sistemas Operacionais</h4>
                <p>Aprenda a instalar, configurar e otimizar sistemas como Windows e Linux.</p>
                <hr />

                <h4>Instalação e Configuração de Programas</h4>
                <p>Saiba instalar softwares, configurar drivers e manter o sistema atualizado e seguro.</p>
                <hr />

                <h4>Lógica de Programação</h4>
                <p>Entenda como os programas funcionam e dê os primeiros passos na criação de software. </p>
                <div className={Style.TextoFinal}>
                    <h2>Leve o aprendizado com você</h2>
                    <p>Estude Hardware e Software onde estiver. <br></br>Aprenda pelo celular, continue no computador e acompanhe seu progresso em tempo real.</p>
                </div> {/*texto final*/}
                <Botoes />
            </div> {/*div de textos hardware e software*/}
            </main>
        </>
    )   
}

export { ConteudoInicial }