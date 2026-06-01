import { useState, useEffect } from 'react';

import FMenina_claro from '../../../fotos/claro/Mulher_Branca.svg';
import FMenina_escuro from '../../../fotos/escuro/Mulher_Escura.svg';
import Raposa_SoftWare from '../../../fotos/Raposa_SoftWare.png';
import apleModoClaro from '../../../fotos/claro/apple-logo-svgrepo-com.svg';
import apleModoEscuro from '../../../fotos/escuro/apple_icon.svg';
import googlePlayModoClaro from '../../../fotos/claro/play.svg';
import googlePlayModoEscuro from '../../../fotos/escuro/play.svg';


// importando componentes para ser ultilizados no ConteudoInicial.jsx
// import FMenina from '../../../fotos/claro/NovaMenina.svg';
import { BotoesApp, BotoesForm } from '../../Botoes';
import { Cards } from '../../Cards';
import { Link, useNavigate } from "react-router-dom";
import { BotaoInstalar } from '../../Botoes/Botao_Instalar';

import Style from './ConteudoInicial.module.css';
import { Carrossel } from './Carrossel/Carrossel';


const ConteudoInicial = () => {

    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');


    useEffect(() => {


        //Tema claro e escuro (não faço ideia oq faz pq ninguem comenta) isso muda o tema, ué
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);


        //
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);


    const FMenina = tema === 'Claro' ? FMenina_claro : FMenina_escuro;

    const ApleIcon = tema === 'Claro' ? apleModoClaro : apleModoEscuro;

    const googleIcon = tema === 'Claro' ? googlePlayModoClaro : googlePlayModoEscuro

    return (
        <div className={Style.corpo}>
            <main className={Style.MainEstilo}>
                <div className={Style.LimitarConteudo}>
                    {/* ===== HERO ===== */}
                    <section className={Style.Apresentacao}>

                        <div className={Style.Apresentacao_texto}>


                            <Carrossel />

                            <div className={Style.Apresentacao_btns}>
                                <Link to="login">
                                    <BotoesForm texto="Entrar" />
                                </Link>
                                <Link to="cadastro">
                                    <BotoesForm texto="Criar uma Conta" className={Style.btnSecundario} />
                                </Link>
                            </div>

                        </div>

                        <div className={Style.Apresentacao_img}>
                            <img src={tema ? FMenina_claro : FMenina_escuro} alt="menina estudando" />
                        </div>

                    </section>

                    <section className={Style.Chamada}>
                        {/* Chamada para ação */}

                        <h3>A tecnologia não é mágica, é lógica</h3>

                        <hr />

                        <h5>Nosso guia introdutório desmistifica o que acontece por trás da tela, ensinando você a enxergar hardware e software como ferramentas de criação, não apenas consumo.</h5>

                    </section>

                    {/* ===== MATERIAIS ===== */}
                    <section className={Style.Materiais}>

                        <div className={Style.CaixaMateriais}>
                            {/* Hardware */}
                            <section className={Style.ConteudoHardware}>

                                <div className={Style.ConteudoHardware_texto}>
                                    <h2>⚙️ Hardware</h2>

                                    <h4>Componentes do Computador</h4>
                                    <p>Entenda como funcionam CPU, RAM, SSD, placa-mãe e placa de vídeo e como cada peça influencia no desempenho.</p>
                                    <hr />

                                    <h4>Montagem e Upgrade</h4>
                                    <p>Aprenda a montar um computador do zero, substituir peças e melhorar a performance com upgrades estratégicos.</p>
                                    <hr />

                                    <h4>Manutenção e Diagnóstico</h4>
                                    <p>Identifique problemas, faça limpeza correta e resolva falhas comuns de hardware.</p>

                                </div>

                                <div className={Style.ConteudoHardware_img}>
                                    <div>img</div>
                                </div>

                            </section>

                            {/* Software */}
                            <section className={Style.ConteudoSoftware}>

                                <div className={Style.ConteudoSoftware_texto}>
                                    <h2>&lt;/&gt; Software</h2>

                                    <h4>Sistemas Operacionais</h4>
                                    <p>Aprenda a instalar, configurar e otimizar sistemas como Windows e Linux.</p>
                                    <hr />
                                    <h4>Instalação e Configuração de Programas</h4>
                                    <p>Saiba instalar softwares, configurar drivers e manter o sistema atualizado e seguro.</p>
                                    <hr />
                                    <h4>Lógica de Programação</h4>
                                    <p>Entenda como os programas funcionam e dê os primeiros passos na criação de software.</p>

                                </div>

                                <div className={Style.ConteudoSoftware_img}>
                                    <img src={Raposa_SoftWare} alt="raposa de software" />
                                </div>

                            </section>
                        </div>
                    </section>

                    {/* ===== TEXTO FINAL ===== */}
                    <div className={Style.aplicativo}>
                        <h2>Baixe o APP</h2>

                        {/* <BotoesApp  /> */}
                        <div className={Style.botoesInstalar}>
                            <BotaoInstalar
                                className={Style.BtnInstal}
                                titulo="Google Play"
                                icon={googleIcon}
                            />
                            <BotaoInstalar
                                icon={ApleIcon}
                                titulo="Apple Store"
                            />

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export { ConteudoInicial };