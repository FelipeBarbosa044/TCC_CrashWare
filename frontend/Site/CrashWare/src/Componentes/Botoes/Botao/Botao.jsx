import Style from './Botao.module.css'

const BotaoInstalar = ({titulo, icon}) =>
{
    return (
        <div className={Style.Botao}>
            <a href="#">
                <img src={icon} alt={titulo} />
                <p>{titulo}</p>
            </a>
        </div>
    )
}

export { BotaoInstalar }