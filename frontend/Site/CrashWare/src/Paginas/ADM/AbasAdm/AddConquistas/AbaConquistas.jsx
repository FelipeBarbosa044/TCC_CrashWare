import { useState } from "react"
import { CampoTexto } from '../../../../Componentes';
import { BotoesForm } from '../../../../Componentes';
import ImgSoftware from "../../../../fotos/imgSoftware.png"
import ImgHardware from "../../../../fotos/imgHardware.png"
import Style from "./AbaConquistas.module.css"
import { Adm } from "../../../../../funcoes/adm";
import { PopUp } from "../../../../Componentes/pop-up";



const AbaConquistas = () => {

    const [nomeConquista, setNomeConquista] = useState("");
    const [descricaoConquista, setDescricaoConquista] = useState("");
    const [condicao, setCondicao] = useState("");
    const [moedas, setMoedas] = useState();
    const [xp, setXP] = useState();
    const [opcao, setOpcao] = useState("");
    const [popup, setPopup] = useState(null);

    const botaoliberado =
        nomeConquista &&
        descricaoConquista &&
        moedas &&
        xp &&
        condicao &&
        opcao;

    const handleAdicionarConquista = () => {
        //Instâncio o objeto
        const conquista = new Adm;

        //Chamo o método
        conquista.adicionar_conquista(nomeConquista, opcao, descricaoConquista, moedas, xp, condicao, setPopup);

    }

    return (
        <>
            {/*Popup Padrão]*/}
            {popup && (
                <PopUp
                    tipo={popup.tipo}
                    titulo={popup.titulo}
                    mensagem={popup.mensagem}
                    onFechar={() => setPopup(null)}
                />
            )}

            <div className={Style.Conteudos}>
                <div className={Style.NomeTipo}>

                    {/* Nome Conquista */}
                    <label htmlFor="NomeConsquista" type="text" className={Style.Margincima}>Nome da Conquista</label>
                    <CampoTexto
                        placeholder="Nome da Conquista"
                        maxLength={100}
                        onChange={(e) => setNomeConquista(e.target.value)}
                    />
                    <p>Máx 100 caracteres</p>

                    {/* Tipo da Conquista */}
                    <h3>Tipo</h3>
            
                    <div className={Style.CaixaRadio}>
                        <label className={Style.RadioTipo}>
                            <CampoTexto name="opcao" value="Software" type="radio"
                                onChange={(e) => setOpcao(e.target.value)}
                            />
                            <img src={ImgSoftware} alt="Software" /> Software
                        </label>

                        <label className={Style.RadioTipo}>
                            <CampoTexto name="opcao" value="Hardware" type="radio"
                                onChange={(e) => setOpcao(e.target.value)}
                            />
                            <img src={ImgHardware} alt="Hardware" /> Hardware
                        </label>
                        <label className={Style.RadioTipo}>
                            <CampoTexto name="opcao" value="Outro" type="radio"
                                onChange={(e) => setOpcao(e.target.value)}
                            />
                            Outro
                        </label>
                    </div> {/* Tipo */}
                </div> {/* Nome e Tipo */}

                <div className={Style.recompensas}>

                    <h1>Recompensas</h1>

                    <div className={Style.inputs}>
                        <label htmlFor="qtdMoedas">Quantidade de moedas</label>
                        <input  type="number"
                                onChange={(e) => setMoedas(e.target.value)} id="qtdMoedas"/>
                    </div>

                    <div className={Style.inputs}>
                        <label htmlFor="qtdXp">Quantidade de xp</label>
                        <input  type="number"
                            onChange={(e) => setXP(e.target.value)} id="qtdXp"/>
                    </div>

                </div>

                <div className={Style.condicoes}>

                    <div className={Style.divInputs}>
                        <div className={Style.inputs}>
                            <label htmlFor="condicoes">Condições</label>
                            <input type="text" id="condicoes" maxLength="300" onChange={(e) => setCondicao(e.target.value)}/>
                            <p>max 300 caracteres</p>
                            
                        </div>
                        <div className={Style.inputs}>
                            <label htmlFor="descricao">Descrição</label>
                            <input type="text" id="descricao" maxLength="300" onChange={(e) => setDescricaoConquista(e.target.value)}/>
                            <p>max 300 caracteres</p>
                        </div>
                    </div>

                    
                    <div className={Style.divDosBotoes}>
                        <button className={Style.botoes}>Limpar campos</button>
                        <button className={Style.botoes}
                                 
                                onClick={handleAdicionarConquista}
                                >Criar
                        </button>
                    </div>
                                              
                    
                
                </div>

            </div> {/* Conteudo */}
        </>
    )
}

export { AbaConquistas }