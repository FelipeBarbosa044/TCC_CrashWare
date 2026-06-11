import Style from './Carrossel.module.css'
import { BotoesForm } from '../../../Botoes';
import { useState } from 'react';

const Carrossel = () => {

    const CadsCarrossel = [
        { id: 1, Titulo: "Gamificação", Texto: "Mantenha sua ofensiva, desbloqueie conquistas e troque seus pontos por cosméticos exclusivos." },
        { id: 2, Titulo: "Aprendizagem Contínua", Texto: "Metas diárias, ofensiva e XP para evoluir a cada dia." },
        { id: 3, Titulo: "Aulas e Exercícios", Texto: "Conteúdos concisos e exercícios práticos para fixar o aprendizado." },
    ];

    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((current - 1 + CadsCarrossel.length) % CadsCarrossel.length);
    const next = () => setCurrent((current + 1) % CadsCarrossel.length);

    return (
        <div className={Style.Carrosel}>
            <div className={Style.Conteudo}>
                <div className={Style.Slides}>
                    <h2>{CadsCarrossel[current].Titulo}</h2>
                    <p>{CadsCarrossel[current].Texto}</p>
                </div>
            </div>


            <div className={Style.Controles}>
                {/* <BotoesForm texto="<" onClick={prev} /> */}

                {CadsCarrossel.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={index === current ? Style.Ativo : Style.Inativo}
                    />
                ))}

                {/* <BotoesForm className={Style.Avancar} texto=">" onClick={next} /> */}
            </div>
        </div>
    );
};

export { Carrossel };