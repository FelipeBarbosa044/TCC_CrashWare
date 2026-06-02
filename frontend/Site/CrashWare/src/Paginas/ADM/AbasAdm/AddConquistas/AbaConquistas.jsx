import { useState } from "react"
import { CampoTexto } from '../../../../Componentes';
import { BotoesForm } from '../../../../Componentes';
import softwareIcon from "../../../../fotos/software.svg";
import hardwareIcon from "../../../../fotos/hardware.svg";
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

    const LimparCampos = () => {
        setNomeConquista("");
        setDescricaoConquista("");
        setCondicao("");
        setMoedas("");
        setXP("");
        setOpcao("");
    };

    const handleAdicionarConquista = () => {
        //Instâncio o objeto
        const conquista = new Adm;

        //Chamo o método
        conquista.adicionar_conquista(nomeConquista, opcao, descricaoConquista, moedas, xp, condicao, setPopup);

    }

    //Enter
    const Criar = () => {
        handleAdicionarConquista()
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

            <div className={Style.Conteudos}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.repeat) {
                        Criar();
                    }
                }}
            >
                <div className={Style.NomeTipo}>

                    {/* Nome Conquista */}
                    <label htmlFor="NomeConsquista" type="text" className={Style.Margincima}>Nome da Conquista</label>
                    <CampoTexto
                        value={nomeConquista}
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
                                checked={opcao === "Software"}
                                onChange={(e) => setOpcao(e.target.value)}
                            />
                            <img src={softwareIcon} alt="Software" /> Software
                        </label>

                        <label className={Style.RadioTipo}>
                            <CampoTexto name="opcao" value="Hardware" type="radio"
                                checked={opcao === "Hardware"}
                                onChange={(e) => setOpcao(e.target.value)}
                            />
                            <img src={hardwareIcon} alt="Hardware" /> Hardware
                        </label>
                        <label className={Style.RadioTipo}>
                            <CampoTexto name="opcao" value="Outro" type="radio"
                                checked={opcao === "Outro"}
                                onChange={(e) => setOpcao(e.target.value)}
                            />
                            Outro
                        </label>
                    </div> {/* Tipo */}
                </div> {/* Nome e Tipo */}

                <div className={Style.recompensas}>

                    <h1>Recompensas</h1>

                    <div className={Style.todosInputs}>
                        <div className={Style.inputs}>
                            <label htmlFor="qtdMoedas">Quantidade de moedas</label>
                            <CampoTexto
                                placeholder="00"
                                className={Style.condicoesInput}
                                type="number"
                                onChange={(e) => setMoedas(e.target.value)}
                                // id="qtdMoedas"
                                value={moedas}
                            />
                        </div>
                        <div className={Style.inputs}>
                            <label htmlFor="qtdXp">Quantidade de xp</label>
                            <CampoTexto
                                placeholder="00"
                                className={Style.condicoesInput}
                                type="number"
                                onChange={(e) => setXP(e.target.value)}
                                // id="qtdXp"
                                value={xp}
                            />
                        </div>
                    </div>

                </div>

                <div className={Style.condicoes}>

                    <div className={Style.divInputs}>
                        <div className={Style.inputs}>
                            <label htmlFor="condicoes">Condições</label>
                            <CampoTexto
                                type="text"
                                placeholder="Diga a condição para ganhar a conquista"
                                className={Style.condicoesInput}
                                maxLength="300"
                                onChange={(e) => setCondicao(e.target.value)}
                                value={condicao}
                            />
                            <p>max 300 caracteres</p>

                        </div>
                        <div className={Style.inputs}>
                            <label htmlFor="descricao">Descrição</label>
                            <CampoTexto
                                type="text"
                                placeholder="Diga a descrição da conquista"
                                className={Style.condicoesInput}
                                maxLength="300"
                                onChange={(e) => setDescricaoConquista(e.target.value)}
                                value={descricaoConquista}
                            />
                            <p>max 300 caracteres</p>
                        </div>
                    </div>


                    <div className={Style.divDosBotoes}>
                        <BotoesForm className={Style.botoes}
                            onClick={LimparCampos}
                            texto="Limpar campos"
                        />

                        <BotoesForm className={Style.botoes}
                            disabled={!botaoliberado}
                            onClick={handleAdicionarConquista}
                            texto="Criar"
                        />
                    </div>
                </div>

            </div> {/* Conteudo */}
        </>
    )
}

export { AbaConquistas }