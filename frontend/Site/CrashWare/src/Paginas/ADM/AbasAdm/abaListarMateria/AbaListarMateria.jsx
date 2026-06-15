import { BotoesForm, CampoTexto } from "../../../../Componentes"
import { useEffect, useState } from "react"
import Style from "./abaListarMateria.module.css"
import { PopUp } from '../../../../Componentes/pop-up';

const MATERIAS_MOCK = [
    { id: 1, titulo: "Introdução ao React", modulo: "1", tipo: "software", descricao: "Aula introdutória sobre os conceitos básicos do React.", xp: 50, moedas: 20 },
    { id: 2, titulo: "Componentes e Props", modulo: "1", tipo: "software", descricao: "Como criar e reutilizar componentes com props.", xp: 60, moedas: 25 },
    { id: 3, titulo: "Hardware Básico", modulo: "2", tipo: "hardware", descricao: "Principais componentes físicos de um computador.", xp: 40, moedas: 15 },
];

const AbaListarMateria = () => {

    const [popup, setPopup] = useState(null);
    const [buscar, setBuscar] = useState("");
    const [materiasInterface, setMaterias] = useState([]);
    const [materiasExibidas, setMateriasExibidas] = useState([]);
    const [materiaAberta, setMateriaAberta] = useState(null);

    useEffect(() => {
        carregarMaterias();
    }, []);

    async function carregarMaterias() {
        setMaterias(MATERIAS_MOCK);
        setMateriasExibidas(MATERIAS_MOCK);
    }

    function Buscar(texto) {
        texto = texto.toLowerCase().trim();

        if (texto === "") {
            setMateriasExibidas(materiasInterface);
            return;
        }

        const resultado = materiasInterface.filter((m) =>
            `${m.id} ${m.titulo} ${m.descricao} ${m.tipo} ${m.modulo}`
                .toLowerCase()
                .includes(texto)
        );

        setMateriasExibidas(resultado);
    }

    async function DeletarMateria(id_materia) {
        try {
            setMaterias((antigas) => antigas.filter((m) => m.id !== id_materia));
            setMateriasExibidas((antigas) => antigas.filter((m) => m.id !== id_materia));
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
                                            <h5>Descrição</h5>
                                            <p>{m.descricao}</p>
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