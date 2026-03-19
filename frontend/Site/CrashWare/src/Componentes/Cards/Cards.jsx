import IconeLivro from '../../fotos/livro_icon.svg'
import IconeCheck from '../../fotos/check_icon.svg'
import IconeComputador from '../../fotos/desktop.svg'
import IconeSeta from '../../fotos/setaTorta_icon.svg'
import IconeOfensiva from '../../fotos/ofensiva_icon.svg'
import IconeCodigo from '../../fotos/code.svg'

import Style from './Cards.module.css'

import { Card } from './Card'
const Cards = () =>
{
    const iconsFoto = 
    [
        { id: 1, titulo: "Lições curtas e organizadas", icon: IconeLivro },
        { id: 2, titulo: "Exercícios práticos e interativos", icon: IconeComputador },
        { id: 3, titulo: "Sistema de níveis e progresso", icon: IconeSeta },
        { id: 4, titulo: "Metas diárias", icon: IconeOfensiva },
        { id: 5, titulo: "Feedback imediato", icon: IconeCheck },
        { id: 6, titulo: "Conteúdo completo de Hardware e Software", icon: IconeCodigo },
    ];


    return (
        <div className={Style.Cards}>
            {iconsFoto.map((card) => (
            <Card key={card.id} titulo={card.titulo} icon={card.icon} />
    ))}
    </div>
    )
}

export { Cards }