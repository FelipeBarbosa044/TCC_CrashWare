import Logo from '../../Logo/logo_sem_fundo.png';
import qrcode from '../../fotos/qrcode.jpeg';
import { Link } from 'react-router-dom';

import Style from './Rodape.module.css';

const Rodape = () => {

    const DataATual = new Date().getFullYear();

    return (
        <>
            <footer className={Style.Rodape}>
                <div className={Style.Container}>
                    <div className={Style.Marca}>
                        <Link to="/">
                            <img src={Logo} alt="" />
                            <h4>CRASHWARE</h4>
                        </Link>
                        <p>Plataforma de Aprendizado de Hardware e Software</p>
                    </div>

                    <div className={Style.Colunas}>
                        <div>
                            <h5>Informações

                            </h5>
                            <Link to='sobre-nos'>
                                <p>Sobre Nós</p>
                            </Link>

                            <Link to="*">
                                <p>Politica de Privacidade</p>
                            </Link>
                        </div>

                        <div>
                            <h5>Informações</h5>
                            <Link to="*">
                                <p>Compromisso com a IntegSridade</p>
                            </Link>

                            <Link to="*">
                                <p>Termos de Uso</p>
                            </Link>
                        </div>
                    </div>

                    <div className={Style.QR}>
                        <h5>BAIXE O APP</h5>
                        <img src={qrcode} alt="" />
                    </div>
                </div>

                <div className={Style.Copy}>
                    <p> ©{DataATual} Crashware. Todos os diretos reservados à equipe de desenvolvimento </p>
                </div>

            </footer>
        </>
    );
};

export { Rodape };