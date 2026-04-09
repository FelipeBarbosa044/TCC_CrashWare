import iconlogin_escuro from '../../fotos/claro/login_icon_claro.svg';
import iconlogin_claro from '../../fotos/escuro/login_icon.svg';

import { Link } from 'react-router-dom';

import Style from './Login.module.css';

const Login = () =>
{
    const { tema } = useTema(); 
    const iconLogin = tema === "claro" ? iconlogin_claro : iconlogin_escuro;

    return (
        <>
            <Link to='/Login'>
                <div className={Style.Login}>
                    <img src={iconLogin} alt="" />
                </div>
            </Link>    
        </>
    );
};

export {  Login };