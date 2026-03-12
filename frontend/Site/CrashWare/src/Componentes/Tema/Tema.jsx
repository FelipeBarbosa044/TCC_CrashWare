import FTema from '../../fotos/lua_icon.svg'
import Style from './Tema.module.css'

const Tema = () =>
{
    return (
        <>
            <img className={Style} src={FTema} alt="" />
        </>
    )
}

export { Tema }