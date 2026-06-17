import { BotoesForm, CampoTexto } from "../../../../Componentes"
import { useEffect, useState } from "react"
import Style from "./abaListarMateria.module.css"
import { PopUp } from '../../../../Componentes/pop-up';
import { Adm } from "../../../../../funcoes/adm";



const AbaListarMateria = () => {

    let  MATERIAS_MOCK =  [];

    const [popup, setPopup] = useState(null);
    const [buscar, setBuscar] = useState("");
    const [materiasInterface, setMaterias] = useState([]);
    const [materiasExibidas, setMateriasExibidas] = useState([]);
    const [materiaAberta, setMateriaAberta] = useState(null);

    useEffect(() => {
        carregarMaterias();
    }, []);

    async function carregarMaterias() {
        //Listo conquistas no banco de dados
        const adm = new Adm();

        //Pego do bd as aulas
        await adm.listar_aulas(setPopup);

        //Pego as aulas em uma array
        const aulas = JSON.parse(localStorage.getItem("aulas")) || [];

        //Pego a quantidade de aulas
        let quantidade_aulas = aulas.length

        //Reinicio as aulas para não duplicar
        MATERIAS_MOCK = [];

         for (let n = 0; n < quantidade_aulas; n++)
        {
            MATERIAS_MOCK.push({ id: aulas[n].id_aula, titulo:aulas[n].titulo , modulo: aulas[n].modulo, tipo: aulas[n].tipo, xp: aulas[n].xp_bonus, moedas: aulas[n].moeda_bonus })

        }

        //Aulas no total
        setMaterias(MATERIAS_MOCK);

        //Aulas Exibidas
        setMateriasExibidas(MATERIAS_MOCK);


    }

    function Buscar(texto) {
        texto = texto.toLowerCase().trim();

        if (texto === "") {
            setMateriasExibidas(materiasInterface);
            return;
        }

        const resultado = materiasInterface.filter((m) =>
            `${m.id} ${m.titulo} ${m.tipo} ${m.modulo}`
                .toLowerCase()
                .includes(texto)
        );

        setMateriasExibidas(resultado);
    }

    async function DeletarMateria(id_aula) {
        try 
        {
    
            //Deleto a aula no banco de dados
            const aula = new Adm;
            await aula.deletar_aula(id_aula,setPopup)

            //Atualizo as aulas
    
            setMaterias((antigas) => antigas.filter((m) => m.id !== id_aula));

            setMateriasExibidas((antigas) => antigas.filter((m) => m.id !== id_aula));

            setMateriaAberta(null);
        } catch (error) {
            setPopup({
                tipo: 'erro',
                titulo: 'Erro ao deletar matéria',
                mensagem: 'Matéria não encontrada.'
            });
        }
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
                <div className={Style.conteudos}>
                    <h1>Matérias</h1>

                    <div className={Style.buscar}>
                        <CampoTexto
                            placeholder="Buscar matérias..."
                            onChange={(e) => setBuscar(e.target.value)}
                        />
                        <BotoesForm
                            className={Style.botaoBuscar}
                            texto="Buscar"
                            onClick={() => Buscar(buscar)}
                        />
                    </div>

                    <div className={Style.lista}>
                        {materiasExibidas.map((m) => (
                            <div
                                className={Style.listaMateria}
                                key={m.id}
                                onClick={() => setMateriaAberta(materiaAberta === m.id ? null : m.id)}
                            >
                                <div className={Style.itensLista}>
                                    <h4>#{m.id}</h4>
                                    <h3>{m.titulo}</h3>
                                    <div className={Style.tags}>
                                        <span className={`${Style.tag} ${m.tipo === "software" ? Style.tagSoftware : Style.tagHardware}`}>
                                            {m.tipo}
                                        </span>
                                        <span className={Style.tagModulo}>Módulo {m.modulo}</span>
                                    </div>
                                </div>

                                {materiaAberta === m.id && (
                                    <div className={Style.sanfona}>
                                        <div className={Style.coluna1}>
                                            <BotoesForm
                                                className={Style.excluir}
                                                texto="Excluir"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    DeletarMateria(m.id);
                                                }}
                                            />
                                        </div>
                                        <div className={Style.coluna2}>
                                            <h5>Recompensas</h5>
                                            <div className={Style.recompensas}>
                                                <div className={Style.recompensaItem}>
                                                    <p className={Style.recompensaLabel}>XP</p>
                                                    <p className={Style.recompensaValor}>+{m.xp}</p>
                                                </div>
                                                <div className={Style.recompensaItem}>
                                                    <p className={Style.recompensaLabel}>Gemas</p>
                                                    <p className={Style.recompensaValor}>+{m.moedas}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {materiasExibidas.length === 0 && (
                            <p className={Style.semResultados}>Nenhuma matéria encontrada.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export { AbaListarMateria };