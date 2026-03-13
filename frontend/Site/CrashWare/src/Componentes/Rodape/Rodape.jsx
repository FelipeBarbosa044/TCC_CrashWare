import Logo from '../../Logo/logo_sem_fundo.png'
import Style from './Rodape.module.css'
const Rodape = () =>
{
    return (
        <>
            <footer className={Style.Rodape}>
                <div className={Style.Marca}>
                    <img src={Logo} alt="" />
                    <h4>CRASHWARE</h4>
                </div>


                <div className={Style.links}>
                    <p>Sobre Nós</p>
                    <p>Politica de Privacidade</p>
                    <p>Compromisso com a IntegSridade</p>
                    <p>Termos de Uso</p>
                </div>
            </footer>
        </>
    )
}

export { Rodape }