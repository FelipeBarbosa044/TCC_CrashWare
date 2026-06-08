import Style from "./ConteudoSobre.module.css";
import hardwareIcon from "../../../fotos/hardware.svg";
import softwareIcon from "../../../fotos/software.svg";
import { useState } from "react";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const ConteudoSobre = () => {

    const Time = [
        {
            id: 1,
            fotinha: "/Gabriel_Foto.jpeg",
            nome: "Gabriel",
            funcao: "FullStack Site",
            agradecimento: "Em especial dedico esse TCC a Deus e meu Senhor Jesus Cristo, sem Deus eu nem estaria aqui e é tudo graças a Ele. Também queria dedicar a uma gatinha, a Luna, que desde o começo esteve comigo e me ajudou em momentos muito difícieis que passei, eu amo essa gatinha. Rm 8:28",
            email: "costasousagabriel075@gmail.com",
            instagram: "https://www.instagram.com/thesousac/"
        },
        {
            id: 2,
            fotinha: "/Felipe_Foto.jpeg",
            nome: "Felipe",
            funcao: "Backend Site e App, Banco de dados",
            agradecimento: "Depois de tantos erros, estresse, bugs e momentos em que eu quase questionei minha existência, uma coisa ficou clara: eu nasci para ser desenvolvedor back- end. No meio do caos, criando a API do zero com FastAPI, estruturando o banco de dados com SQLAlchemy e conectando tudo entre aplicativo, site e servidor, eu encontrei a área em que realmente quero seguir.",
            email: "felipebarbosaribeiro197@gmail.com",
            linkedin: "https://www.linkedin.com/in/felipe-barbosa-ribeiro-a93b9a320/",
            instagram: "https://www.instagram.com/nesferaz/"
        },
        {
            id: 3,
            fotinha: "/Joao_Foto.jpeg",
            nome: "João Vitor Duarte da Costa",
            funcao: "Backend do App",
            email: "joaovitorduartedacosta@gmail.com",
            linkedin: "https://www.linkedin.com/in/joão-vitor-duarte-da-costa-26b799376?utm_source=share_via&utm_content=profile&utm_medium=member_android",
            instagram: "https://www.instagram.com/duarte_jv23?igsh=MW9jNW4xMzB1a3FiYw=="
        }
    ];

const [current, setCurrent] = useState(0);
const prev = () => setCurrent((current - 1 + Time.length) % Time.length);
const next = () => setCurrent((current + 1) % Time.length);
const pessoa = Time[current];

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
                <p>Mais do que ensinar conteúdos técnicos, a proposta da CrashWare é mostrar aos estudantes como realmente funciona a área da tecnologia, preparando iniciantes para desenvolver raciocínio lógico, autonomia e habilidades essenciais para o futuro. Este projeto busca demonstrar que, com direção correta, prática e acesso ao</p>

                <hr />

                {/* Equipe */}
                <div className={Style.Equipe}>
                    <h1 className={Style.EquipeTitulo}>Conheça a Nossa Equipe</h1>

                    <div className={Style.Carrossel}>

                        {/* Foto */}
                        <div className={Style.FotoWrap}>
                            <img src={pessoa.fotinha} alt={pessoa.nome} className={Style.Foto} />
                            <span className={Style.FuncaoBadge}>{pessoa.funcao}</span>
                        </div>

                        {/* Info */}
                        <div className={Style.Body}>
                            <div className={Style.NomeFuncao}>
                                <h2 className={Style.Nome}>{pessoa.nome}</h2>
                                {/* <span className={Style.Funcao}>{pessoa.funcao}</span> */}
                            </div>

                            {/* Redes sociais */}
                            <div className={Style.Sociais}>
                                {pessoa.email && (
                                    <a href={`mailto:${pessoa.email}`} className={Style.SocialBtn} title="E-mail">
                                        <MdEmail size={18} />
                                        <span>E-mail</span>
                                    </a>
                                )}
                                {pessoa.linkedin && (
                                    <a href={pessoa.linkedin} target="_blank" rel="noreferrer" className={Style.SocialBtn} title="LinkedIn">
                                        <FaLinkedinIn size={16} />
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                                {pessoa.instagram && (
                                    <a href={pessoa.instagram} target="_blank" rel="noreferrer" className={Style.SocialBtn} title="Instagram">
                                        <FaInstagram size={16} />
                                        <span>Instagram</span>
                                    </a>
                                )}
                            </div>

                            <div className={Style.Divider} />

                            {/* Agradecimento */}
                            <p className={Style.Agradecimento}>{pessoa.agradecimento}</p>
                        </div>

                        {/* Controles */}
                        <div className={Style.Controles}>
                            <button onClick={prev} className={Style.BtnNav}>&#8592;</button>

                            {Time.map((_, index) => (
                                <span
                                    key={index}
                                    onClick={() => setCurrent(index)}
                                    className={index === current ? Style.Ativo : Style.Inativo}
                                />
                            ))}

                            <button onClick={next} className={`${Style.BtnNav} ${Style.Avancar}`}>&#8594;</button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </>
);
};

export { ConteudoSobre };