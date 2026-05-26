import Style from "./ConteudoSobre.module.css";
import hardwareIcon from "../../../fotos/hardware.svg";
import softwareIcon from "../../../fotos/software.svg";

import { PopUpBanido } from "../../../Componentes";

const ConteudoSobre = () => {
    return (
        <>
            <div className={Style.corpo}>
                <div className={Style.container}>
                    <h1>Sobre o TCC</h1>
                    <p>A CrashWare foi desenvolvida como um Trabalho de Conclusão de Curso com o objetivo de enfrentar um problema cada vez mais presente na área da tecnologia: a dificuldade que estudantes iniciantes encontram para começar a aprender hardware e software de forma clara e organizada.</p>
                    <p>Atualmente, muitas escolas oferecem pouco contato com tecnologia além do básico, enquanto a internet possui conteúdos excessivos, desorganizados e muitas vezes avançados demais para quem está começando. Isso faz com que muitas pessoas se sintam perdidas ou desistam antes mesmo de desenvolver uma base sólida.</p>
                    <p>Pensando nisso, a CrashWare surgiu como uma plataforma educacional gratuita focada em transformar o aprendizado de tecnologia em algo mais acessível, progressivo e motivador.</p>
                    <p>O projeto utiliza uma abordagem gamificada para tornar a experiência mais dinâmica, incentivando a evolução contínua do estudante através de progresso, conquistas e trilhas organizadas.</p>
                    <h2>A plataforma possui duas áreas principais de aprendizado:</h2>
                    <div className={Style.trilhas}>
                        <div className={Style.parteHardware}>
                            <div className={Style.tituloImagem}>
                                <h3>Hardware</h3>
                                <img src={hardwareIcon} alt="hardware" />
                            </div>
                            <p>abordando componentes, montagem, manutenção e funcionamento dos computadores.</p>
                        </div>

                        <div className={Style.parteSoftware}>
                            <div className={Style.tituloImagem}>
                                <h3>Software</h3>
                                <img src={softwareIcon} alt="software" />
                            </div>
                            <p>ensinando lógica de programação, sistemas operacionais e fundamentos do desenvolvimento.</p>
                        </div>
                    </div>

                    <p>
                        Mais do que ensinar conteúdos técnicos, a proposta da CrashWare é mostrar aos estudantes como realmente funciona a área da tecnologia, preparando iniciantes para desenvolver raciocínio lógico, autonomia e habilidades essenciais para o futuro.
                        Este projeto busca demonstrar que, com direção correta, prática e acesso ao
                    </p>
                </div>
            </div>
        </>
    );
};

export { ConteudoSobre };