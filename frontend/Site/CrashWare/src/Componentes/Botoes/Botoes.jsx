import Playicon from '../../fotos/icons8-google-play.svg'
import Appleicon from '../../fotos/apple_icon.svg'
import Style from './Botoes.module.css'
import { BotaoInstalar } from './Botao_Instalar'

    const iconsFoto = 
    [
        { id: 1, titulo: "GooglePlay", icon: Playicon },
        { id: 2, titulo: "AppleStore", icon: Appleicon },
    ]

const Botoes = () =>
{
    return (
        <div className={Style.Caixa}>
            {iconsFoto.map((botao) => (
                <BotaoInstalar key={botao.id} titulo={botao.titulo} icon={botao.icon} />
            ))}
        </div>
    )
}

export { Botoes }