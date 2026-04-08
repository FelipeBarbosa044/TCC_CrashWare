// importando componentes para ser ultilizados no ConteudoInicial.jsx
import FMenina from '../../../fotos/menina_estudando.png';
import { Botoes } from '../../Botoes';
import { Cards } from '../../Cards';
import { Link } from "react-router-dom";

// importando o estilo
import Style from './ConteudoInicial.module.css';

const ConteudoInicial = () => {
    return (
        <>
            <main>

                {/* ===== HERO ===== */}
                <section className={Style.Apresentacao}>

                    <div className={Style.Apresentacao_texto}>
                        <h3>
                            Aprenda <span className={Style.hardware}>Hardware</span> e{' '}
                            <span className={Style.software}>Software</span> de forma prática e envolvente
                        </h3>

                        <div className={Style.Apresentacao_btns}>
                            <Link to="login">
                                <button>Fazer Login</button>
                            </Link>
                            <Link to="cadastro">
                                <button className={Style.btnSecundario}>Se Cadastrar</button>
                            </Link>
                        </div>

                    </div>

                    <div className={Style.Apresentacao_img}>
                        <img src={FMenina} alt="menina estudando" />
                    </div>

                </section>

                {/* ===== DIFERENCIAIS ===== */}
                <section className={Style.Diferenciais}>
                    <h2>Nossos Diferenciais</h2>
                    <Cards />
                </section>

                {/* ===== MATERIAIS ===== */}
                <section className={Style.Materiais}>
                    <h2>Materiais Revisados</h2>

                    {/* Hardware */}
                    <section className={Style.ConteudoHardware}>

                        <div className={Style.ConteudoHardware_img}>
                            <div>img</div>
                        </div>

                        <div className={Style.ConteudoHardware_texto}>
                            <h2>⚙️ Hardware</h2><hr />
                                
                            <h4>Componentes do Computador</h4>
                                <p>Entenda como funcionam CPU, RAM, SSD, placa-mãe e placa de vídeo e como cada peça influencia no desempenho.</p>
                                <hr />

                            <h4>Montagem e Upgrade</h4>
                                <p>Aprenda a montar um computador do zero, substituir peças e melhorar a performance com upgrades estratégicos.</p>
                                <hr />

                            <h4>Manutenção e Diagnóstico</h4>
                                <p>Identifique problemas, faça limpeza correta e resolva falhas comuns de hardware.</p>
                                <hr />
                        </div>

                    </section>

                    {/* Software */}
                    <section className={Style.ConteudoSoftware}>

                        <div className={Style.ConteudoSoftware_texto}>
                            <h2>&lt;/&gt; Software</h2><hr />
                            
                            <h4>Sistemas Operacionais</h4>
                                <p>Aprenda a instalar, configurar e otimizar sistemas como Windows e Linux.</p>
                                <hr />
                            <h4>Instalação e Configuração de Programas</h4>
                                <p>Saiba instalar softwares, configurar drivers e manter o sistema atualizado e seguro.</p>
                                <hr />
                            <h4>Lógica de Programação</h4>
                                <p>Entenda como os programas funcionam e dê os primeiros passos na criação de software.</p>
                                <hr />
                        </div>

                        <div className={Style.ConteudoSoftware_img}>
                            <div>img</div>
                        </div>

                    </section>

                </section>

                {/* ===== TEXTO FINAL ===== */}
                <div className={Style.aplicativo}>
                    <h2>Leve o aprendizado com você</h2>
                    <p className={Style.textos}>
                        Estude <span className={Style.hardware}>Hardware</span> e{' '}
                        <span className={Style.software}>Software</span> onde estiver, {' '}
                         Aprenda pelo celular, continue no computador e acompanhe seu progresso em tempo real.
                    </p>
                    <Botoes />
                </div>

            </main>
        </>
    );
};

export { ConteudoInicial };