import { Routes, Route } from "react-router-dom"
import { PgInicial, PgCadastro, SobreNos, PgLogin, PgErro, PgRecuperarSenha, PgVerificacaoEmail, PgPerfil, PgAnotacoes, PgConfiguracoes, PgHome, PgTermos, AbaConquistas, AbaUsuarios, PgConteudoHardware, PgAlterarSenha, AbaRelatorios, PgConteudoSoftware, AbaCriarMateria, PgLoja, PgSobre, PgVerificarTelefone } from "./Paginas"
import { LayoutPadrao, LayoutADM, LayoutLogado, LayoutForm } from "./Layouts"
import { AuthProvider, RotaAdm, RotaPrivada } from "./Rotas"
import { AbaListarConquistas } from "./Paginas/ADM/AbasAdm/AbaListarConquistas"

import { PgComoFunciona, PgMotivacaoMentalidade } from "./Paginas"


const Router = () => {
    return (
        <Routes>

            {/* Layout Padrão */}
            <Route path="/" element={<LayoutPadrao />}>

                <Route
                    index
                    element={
                        <AuthProvider>
                            <PgInicial />
                        </AuthProvider>
                    }
                />

                <Route path="recuperar-senha" element={<PgRecuperarSenha />} />
                <Route path="verificacao-email" element={<PgVerificacaoEmail />} />
                <Route path="alterar-senha" element={<PgAlterarSenha />} />
                <Route path="*" element={<PgErro />} />
            </Route>

            <Route path="/" element={<LayoutForm />}>
                <Route
                    path="cadastro"
                    element={
                        <AuthProvider>
                            <PgCadastro />
                        </AuthProvider>
                    }
                />

                <Route
                    path="login"
                    element={
                        <AuthProvider>
                            <PgLogin />
                        </AuthProvider>
                    }
                />
            </Route>

            {/* Layout Logado */}
            <Route path="/" element={<LayoutLogado />}>

                <Route
                    path="perfil"
                    element={
                        <RotaPrivada>
                            <PgPerfil />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="configuracoes"
                    element={
                        <RotaPrivada>
                            <PgConfiguracoes />
                        </RotaPrivada>
                    }
                />

                <Route path="alterar-senha" element={
                    <RotaPrivada>
                        <PgAlterarSenha />
                    </RotaPrivada>
                }
                />

                <Route
                    path="anotacoes"
                    element={
                        <RotaPrivada>
                            <PgAnotacoes />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="home"
                    element={
                        <RotaPrivada>
                            <PgHome />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="termos"
                    element={
                        <RotaPrivada>
                            <PgTermos />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="verificar-telefone"
                    element={
                        <RotaPrivada>
                            <PgVerificarTelefone />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="hardware"
                    element={
                        <RotaPrivada>
                            <PgConteudoHardware />
                        </RotaPrivada>
                    } />

                <Route
                    path="software"
                    element={
                        <RotaPrivada>
                            <PgConteudoSoftware />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="comoFunciona"
                    element={
                        <RotaPrivada>
                            <PgComoFunciona />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="MotivacaoMentalidade"
                    element={
                        <RotaPrivada>
                            <PgMotivacaoMentalidade />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="loja"
                    element={
                        <RotaPrivada>
                            <PgLoja />
                        </RotaPrivada>
                    }
                />

                <Route
                    path="sobre"
                    element={
                        // <RotaPrivada>
                        <PgSobre />
                        /* </RotaPrivada> */
                    }
                />

            </Route>

            {/* ADM */}
            <Route path="/" element={<LayoutADM />}>

                <Route
                    path="relatorio"
                    element={
                        <RotaAdm>
                            <AbaRelatorios />
                        </RotaAdm>
                    }
                />

                <Route
                    path="criar-conquista"
                    element={
                        <RotaAdm>
                            <AbaConquistas />
                        </RotaAdm>
                    }
                />

                <Route
                    path="listar-conquistas"
                    element={
                        <RotaAdm>
                            <AbaListarConquistas />
                        </RotaAdm>
                    }
                />

                <Route
                    path="usuarios"
                    element={
                        <RotaAdm>
                            <AbaUsuarios />
                        </RotaAdm>
                    }
                />

                <Route
                    path="criar-materia"
                    element={
                        <RotaAdm>
                            <AbaCriarMateria />
                        </RotaAdm>
                    }
                />
            </Route>

        </Routes>
    );
};

export { Router };