import { useState } from "react";

import style from './PerfilUsuario.module.css'

const PerfilUsuario = () => {

    //Uso useState para o react renderizar as informações
    const [token_state, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
    const [dados, setDados] = useState(() =>
        JSON.parse(localStorage.getItem("dados")) || null
    );

    //Pego as informações do usuario
    let usuario = JSON.parse(localStorage.getItem("dados"));

    // muda a foto
    const [foto, setFoto] = useState(usuario?.foto);
    const [banner, setBanner] = useState(usuario?.banner);

    //Cache da foto
    const [versaoFoto, setVersaoFoto] = useState(Date.now());
    const [versaoBanner, setVersaoBanner] = useState(Date.now());

    const id = usuario?.id || "XX";
    const nome = usuario?.nome || "Usuário";
    const email = usuario?.email || "Email";

    //Atualizo XP/GEMA e Patente
    async function atualizarRecursos() {
        //Crio o bjeto que contem requisições para o banco
        const user = new Usuario(token, refresh_token, Navegacao, set);

        //Verifico Patente
        await user.subir_patente(usuario?.email, setPatente, setDados)

        //Atualizo os xp e gema
        user.atulizar_recursos(usuario?.email, setDados, setTotalGemas)
    }

    //Informações do usuario
    const [ofensiva, setOfensiva] = useState(0);
    const [totalCompras, setTotalCompras] = useState(0);
    let gemas = usuario?.moedas ?? 0;
    const [patente, setPatente] = useState(usuario?.patente);

    //Popup
    const [popup, setPopup] = useState(null);

    // const XpMax = 500;
    let xp = usuario?.xp ?? 0;

    const xpAtual = xp % 500;
    const Nivel = Math.min(Math.floor(xp / 500) + 1, 15);

    const porcentagem = (xpAtual / 500) * 100;

    //Trata a data do mês
    const DataCadastro = usuario?.criado_em;

    const formatarData = (DataCadastro) => {
        const [dia, mes, ano] = DataCadastro.split('/');
        const date = new Date(`${ano}-${mes}-${dia}`);

        const mesNome = date.toLocaleString('pt-BR', { month: 'long' });

        return `Membro desde ${mesNome} de ${ano}`;
    };

    return (
        <div className={style.corpo}>


            {/* ── Banner ─────────────────────────────────────── */}
            <div className={style.banner}>
                <img
                    src={`https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/banner/${usuario?.banner}?v=${versaoBanner}`} alt="Banner do usuário"
                    onClick={() => setMudarBanner(!MudarBanner)}
                />

            </div>

            <div className={style.container}>
                <div>
                    <div className={style.apresentacao}>
                        <div className={style.fotoPerfil}>
                            <img
                                className={style.foto}
                                src={`https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/${usuario?.foto}?v=${versaoFoto}`}
                                alt="Foto de perfil"
                                onClick={() => setMudarFoto(!MudarFoto)}
                            />
                        </div>
                        <div className={style.agruparRaposaDados}>
                            <div className={style.texto}>
                                <h3>{nome}</h3>
                                <h4>id: {id}</h4>
                                <h4>Email: {email}</h4>

                                <div className={style.status}>
                                    <span className={style.bolinha}></span>
                                    <p>{formatarData(DataCadastro)}</p>
                                </div>
                                <div className={style.Nivel}>
                                    <div className={style.NivelTopo}>
                                        <p>Nível {Nivel}</p>
                                        <span>{xpAtual} XP</span>
                                    </div>
                                    <div className={style.Barra}>
                                        <div
                                            className={style.Progresso}
                                            style={{ width: `${porcentagem}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PerfilUsuario }