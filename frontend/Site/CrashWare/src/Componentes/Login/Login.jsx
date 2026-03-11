import FLogin from '../../fotos/login_icon.svg'
import Style from './Login.module.css'

const Login = () =>
{
    return (
        <>
            <div className={Style.Login}>
                <img src={FLogin} alt="" />
            </div>
        </>
    )
}

export {  Login }