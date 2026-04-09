import { useState, useEffect } from 'react';

import iconLivro_claro from '../../fotos/claro/livro_icon_claro.svg';
import iconComputador_claro from '../../fotos/claro/computador.svg';
import iconSeta_claro from '../../fotos/claro/setaTorta_icon_claro.svg';
import iconOfensiva_claro from '../../fotos/claro/ofensiva_icon_claro.svg';
import iconCheck_claro from '../../fotos/claro/check_icon.svg';
import iconCode_claro from '../../fotos/claro/code.svg';

import iconLivro_escuro from '../../fotos/escuro/livro_icon.svg';
import iconComputador_escuro from '../../fotos/escuro/computador_claro.svg';
import iconSeta_escuro from '../../fotos/escuro/setaTorta_icon.svg';
import iconOfensiva_escuro from '../../fotos/escuro/ofensiva_icon.svg';
import iconCheck_escuro from '../../fotos/escuro/check_icon_claro.svg';
import iconCode_escuro from '../../fotos/escuro/code_claro.svg';

import { Card } from './Card';
import Style from './Cards.module.css';

const Cards = () => {
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');

    useEffect(() => {
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    const isClaro = tema === 'Claro';

    const iconsFoto = [
        { id: 1, titulo: "Lições curtas e organizadas",              icon: isClaro ? iconLivro_claro      : iconLivro_escuro      },
        { id: 2, titulo: "Exercícios práticos e interativos",        icon: isClaro ? iconComputador_claro : iconComputador_escuro },
        { id: 3, titulo: "Sistema de níveis e progresso",            icon: isClaro ? iconSeta_claro       : iconSeta_escuro       },
        { id: 4, titulo: "Metas diárias",                            icon: isClaro ? iconOfensiva_claro   : iconOfensiva_escuro   },
        { id: 5, titulo: "Feedback imediato",                        icon: isClaro ? iconCheck_claro      : iconCheck_escuro      },
        { id: 6, titulo: "Conteúdo completo de Hardware e Software", icon: isClaro ? iconCode_claro       : iconCode_escuro       },
    ];

    return (
        <div className={Style.Cards}>
            {iconsFoto.map((card) => (
                <Card key={card.id} titulo={card.titulo} icon={card.icon} />
            ))}
        </div>
    );
};

export { Cards };