import { BotoesForm, CampoTexto } from "../../../../Componentes"
import { useEffect, useState } from "react"
import Style from "./AbaListarConquistas.module.css"
import { Adm } from "../../../../../funcoes/adm";
import { PopUp } from '../../../../Componentes/pop-up';

const AbaListarConquistas = () => {
    //Popup
    const [popup, setPopup] = useState(null);

    //Buscas
    const [buscar, setBuscar] = useState("");

    let [conquistasInterface, setConquistas] = useState([]);

    //
    let [conquistasExibidas, setConquistasExibidas] = useState([]);

    //Abrir Conquistas
    const [AbrirConquista, setAbrirConquista] = useState(false);


    useEffect(() => {
        //Quando a pag for carregada
        carregarConquistas();

    }, []);

    async function carregarConquistas() {
        //Listo conquistas no banco de dados
        const adm = new Adm;
        await adm.listar_conquista(setPopup);

        //Pego as conquistar em uma array
        const conquistas = JSON.parse(localStorage.getItem("conquistas")) || [];

        //Interace das conquistas
        const CONQUISTAS_MOCK = []

        //Pego a quantidade de consquistas
        let quantidade_conquistas = conquistas.length

        //Adiciono as conquistas na interface

        for (let n = 0; n < quantidade_conquistas; n++) {
            CONQUISTAS_MOCK.push({ id: conquistas[n].id_conquista, titulo: conquistas[n].nome_conquista, descricao: conquistas[n].descricao, tipo: conquistas[n].tipo_conquista, condicao: conquistas[n].condicao_conquista, botao: <BotoesForm texto="Excluir" /> })

        }


        //Conquistas no total
        setConquistas(CONQUISTAS_MOCK)

        //Conquistas exibidas
        setConquistasExibidas(CONQUISTAS_MOCK);

    }


    function Buscar(texto) {

        texto = texto.toLowerCase().trim();

        if (texto === "") {
            setConquistasExibidas(conquistasInterface);
            return;
        }

        const resultado = conquistasInterface.filter((c) =>
            `${c.id}${c.titulo} ${c.descricao} ${c.tipo} ${c.condicao}`
                .toLowerCase()
                .includes(texto)
        );

        setConquistasExibidas(resultado);
    }


    return (
        <>
            {popup && (
                <PopUp
                    tipo={popup.tipo}
                    titulo={popup.titulo}
                    mensagem={popup.mensagem}
                    onFechar={() => setPopup(null)}
                />
            )}
            <div className={Style.separarConteudos}>
                <div className={Style.Conteudos}>
                    <h1>Conquistas</h1>
                    <div className={Style.Buscar}>
                        <CampoTexto
                            placeholder="Buscar conquistas..."
                            onChange={(e) => setBuscar(e.target.value)}
                        />
                        <BotoesForm
                            className={Style.botaoBuscar}
                            texto="Buscar"
                            onClick={() => Buscar(buscar)}
                        />
                    </div>

                    <div className={Style.Lista}>
                        <div>
                            {conquistasExibidas.map((c) => (
                                <div className={Style.ListaConquistas}
                                    key={c.id}
                                    onClick={() => setAbrirConquista(AbrirConquista === c.id ? null : c.id)}
                                >

                                    <div className={Style.ItensLista}>
                                        <h4>{c.id}</h4>
                                        <h3>{c.titulo}</h3>
                                        <h6>Tipo:
                                            <span>   {c.tipo}</span>
                                        </h6>
                                    </div>

                                    {AbrirConquista === c.id && (
                                        <div className={Style.sanfona}>
                                            <div className={Style.Coluna1}>
                                                <h5>Descrição: </h5>
                                                <p>{c.descricao}</p>
                                            <p className={Style.Exlcuir}>{c.botao}</p>

                                            </div>
                                            <div>
                                                <h5>Condição: </h5>
                                                <p>{c.condicao}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div> {/* Conteudos */}
            </div>
        </>
    )
}

export { AbaListarConquistas }