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
                    <label htmlFor="NomeConsquista" className={Style.Margincima}>Nome da Conquista</label>
                    <CampoTexto
                        placeholder="Nome da Conquista"
                        maxlenght={100}
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
            </div> {/* Conteudo */}
        </>
    )
}

export { AbaConquistas }