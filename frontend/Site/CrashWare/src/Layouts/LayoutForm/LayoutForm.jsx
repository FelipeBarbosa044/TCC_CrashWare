import { Cabecalho, Tema } from "../../Componentes";
import { Outlet } from "react-router-dom";

import Style from './LayoutForm.module.css'

const LayoutForm = () => {
    return (
        <>
            <Cabecalho>
                <div className={Style.Temabtn}>
                    <Tema />
                </div>
            </Cabecalho>
            <Outlet />
        </>
    )
}

export { LayoutForm }