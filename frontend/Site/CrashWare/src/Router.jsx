import { Routes, Route } from "react-router-dom"
import { PgInicial, PgCadastro, SobreNos } from "./Paginas"
import { LayoutPadrao, LayoutCadLogin } from "./Layouts"

const Router = () =>
{
    return (
        <Routes>
            <Route path="/" element={<LayoutPadrao />}>
                <Route path="/" element={<PgInicial />}/>
                <Route path="sobre-nos" element={<SobreNos />}/>
            </Route>

            <Route path="/" element={<LayoutCadLogin />}>
                <Route path="cadastro" element={<PgCadastro />}/>
                {/* <Route path="login" element={} /> */}
            </Route>

        </Routes>
    )
}

export { Router }