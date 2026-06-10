import { Cabecalho, Tema } from "../../Componentes";
import { Outlet } from "react-router-dom";

const LayoutForm = () => {
    return (
        <>
            <Cabecalho>
                <Tema />
            </Cabecalho>
            <Outlet />
        </>
    )
}

export { LayoutForm }