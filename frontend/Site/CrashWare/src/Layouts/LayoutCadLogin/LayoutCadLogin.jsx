import { Outlet } from "react-router-dom";
import { Cabecalho, LinksCabecalho, Tema } from "../../Componentes";
import style from "./LayoutCadLogin.module.css"

const LayoutCadLogin = () =>
{
    return(
        <>
            <Cabecalho>
                <div className={style.Direita}>
                    <LinksCabecalho textolink="Sobre o TCC" link="/sobre-nos" />
                    <LinksCabecalho textolink="Termos de Serviço" link="*" />
                    <div className={style.trocarTema}>
                        <Tema />
                    </div>
                </div>
            </Cabecalho>
            
            <Outlet />
        </>
    );
};

export { LayoutCadLogin };