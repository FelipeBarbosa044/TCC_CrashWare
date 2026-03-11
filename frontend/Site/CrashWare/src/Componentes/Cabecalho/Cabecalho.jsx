import Logo from '../../Logo/logo_sem_fundo.png'
import { Configuracoes } from '../Configuracoes'
import { Login } from '../Login'
import Style from './Cabecalho.module.css'
const Cabecalho = () =>
{
    return (
        <>
        <div className={Style.Cabecalho}>
            <img src={Logo} alt="" />
            <h5>CrashWare</h5>

            <div className={Style.Direita}>
                <Configuracoes />
                <Login />
            </div>
        </div>


        </>
    )
}

export { Cabecalho }