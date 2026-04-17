import { Outlet } from "react-router-dom";
import { Cabecalho, LinksCabecalho, Rodape, Tema } from "../../Componentes";
import style from './LayoutPadrao.module.css'

const LayoutPadrao = () => {
    return (
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
            <Rodape />
        </>
    );
};

export { LayoutPadrao };