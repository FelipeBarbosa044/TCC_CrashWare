import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import style from './PerfilUsuario.module.css'

const PerfilUsuario = () => {

    //Navegação e recebimento de dados
    const location = useLocation();
    const Navegacao = useNavigate();

    //Recebe Os dados
    const nome = location.state?.nome;
    const email = location.state?.email;
    const id = location.state?.id;
    const foto = location.state.foto;
    const banner = location.state.banner;
    const DataCadastro = location.state.criado_em;
    const origem = location.state?.origem;


    //Popup
    const [popup, setPopup] = useState(null);


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
                    src={`https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/banner/${banner}`} alt="Banner do usuário"
                />

            </div>

            <div className={style.container}>
                <div>
                    <div className={style.apresentacao}>
                        <div className={style.fotoPerfil}>
                            <img
                                className={style.foto}
                                src={`https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/${foto}`}
                                alt="Foto de perfil"
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { PerfilUsuario }