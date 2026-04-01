import { Outlet } from "react-router-dom";
import { Cabecalho, Rodape } from "../../Componentes";

const LayoutPadrao = () =>
{
    return (
        <>
            <Cabecalho />
            <Outlet/>
            <Rodape />
        </>
    );
};

export { LayoutPadrao };