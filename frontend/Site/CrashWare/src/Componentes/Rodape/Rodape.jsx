import Logo from '../../Logo/logo_sem_fundo.png';
import { Link } from 'react-router-dom';

import Style from './Rodape.module.css';

const Rodape = () =>
{
    return (
        <>
            <footer className={Style.Rodape}>
                
                <div className={Style.Marca}>
                    <Link to="/">
                        <img src={Logo} alt="" />
                        <h4>CRASHWARE</h4>
                    </Link>
                </div>


                <div className={Style.links}>
                    <Link to='sobre-nos'>
                        <p>Sobre Nós</p>
                    </Link>
                    <Link to="*">
                        <p>Politica de Privacidade</p>
                    </Link>
                    <Link to="*">
                        <p>Compromisso com a IntegSridade</p>
                    </Link>
                    <Link to="*">
                        <p>Termos de Uso</p>
                    </Link>
                </div>
            </footer>
        </>
    );
};

export { Rodape };