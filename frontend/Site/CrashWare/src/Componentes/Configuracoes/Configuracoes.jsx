import FConfig from '../../fotos/configurações_icon.svg'
import Style from './Configuracoes.module.css'

const Configuracoes = () =>
{
    return (
        <>
            <div className={Style.Config}>
                 <img src={FConfig} alt="Configuracoes" />
            </div>
        </>
    )
}

export { Configuracoes }