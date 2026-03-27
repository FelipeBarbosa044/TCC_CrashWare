import { Outlet } from "react-router-dom"
import { Cabecalho, Rodape } from "../../Componentes"

const LayoutCadLogin = () =>
{
    return(
        <>
            <Cabecalho />
            <Outlet />
        </>
    )
}

export { LayoutCadLogin }