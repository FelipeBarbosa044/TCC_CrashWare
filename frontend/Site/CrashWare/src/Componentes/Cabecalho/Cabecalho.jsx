import Logo from '../../Logo/logo_sem_fundo.png'
import { Configuracoes } from '../Configuracoes'
import { Login } from '../Login'
import { Tema } from '../Tema'
import { Link } from 'react-router-dom'
import Style from './Cabecalho.module.css'
const Cabecalho = () =>
{
    return (
        <>
        <div className={Style.Cabecalho}>
            <Link to="/">
                <img className={Style.logo_legal} src={Logo} alt="" />
                <h5>CRASHWARE</h5>
            </Link>

            <div className={Style.Direita}>
                <Tema />
                <Login />
            </div>
        </div>


        </>
    )
}

export { Cabecalho }