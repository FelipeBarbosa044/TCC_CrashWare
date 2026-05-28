import { CampoTexto } from '../../CampoTexto'
import { BotoesForm } from '../../Botoes/'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { PopUp } from '../../pop-up';

import esconderSenha_claro from '../../../fotos/claro/nao_pode_ver_senha.svg';
import verSenha_claro from '../../../fotos/claro/pode_ver_senha.svg';


import style from './ConteudoAlterarSenha.module.css'


//Importando sleep
import { Api, sleep } from "../../../../funcoes/functions"


const ConteudoAlterarSenha = () => {
    const [senha, setSenha] = useState();
    const [confirmaSenha, setConfirmaSenha] = useState();
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');
    const [mostrar, setMostrar] = useState(false);
    const [mostrarConfimar, setMostrarConfimar] = useState(false);


    //Usestates do token refresh e dados
    const [token_state, setToken] = useState(() => localStorage.getItem("token"));

    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));

    const [dados, setDados] = useState(() =>
        JSON.parse(localStorage.getItem("dados")) || null
    );
    

    //Variavel da popup
    const [popup, setPopup] = useState(null);

    //Navegação
    const Navegacao = useNavigate();
    const location = useLocation();

    //Recebendo os dados da navegação
    const email = location.state?.email;



    //Troca de Tema
    useEffect(() => {
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);

        //Quando a pag for acessada
        localStorage.setItem("rec_senha", false)


        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    //Mudar tema
    const isClaro = tema === 'Claro';

    const iconeSenha = mostrar
        ? (verSenha_claro )
        : (esconderSenha_claro );

    const iconeConfirmaSenha = mostrarConfimar
        ? ( verSenha_claro )
        : (esconderSenha_claro );



    const MudarSenha = async () =>
    {
        //Instâncio o objeto 
        const usuario = new Api();

        //Chamo o método
        usuario.Alterar_Senha(email,senha,confirmaSenha,setPopup,Navegacao,setToken,setRefresh,setDados);


        
    }

    return (
        <>
            {popup && (
                <PopUp
                    tipo={popup.tipo}
                    titulo={popup.titulo}
                    mensagem={popup.mensagem}
                    onFechar={() => setPopup(null)}
                />
            )}


        <div className={`${style.corpo} ${tema}`}>
            <div className={style.container}>
                <h1>Alterar Senha</h1>

                <h2>Digite sua Nova Senha</h2>
                <div className={style.senhaWrapper}>
                    <CampoTexto
                        type={mostrar ? "text" : "password"}
                        className={style.inputClasse}
                        placeholder="Senha*"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        maxLength={30}
                    />
                    <img
                        src={iconeSenha}
                        alt="ver senha"
                        className={style.imgSenha}
                        onClick={() => setMostrar(!mostrar)}
                    />
                </div>
                <p>Minino 8 caracteres</p>
                <h2>Confirme sua nova senha</h2>

                <div className={style.senhaWrapper}>
                    <CampoTexto
                        type={mostrarConfimar ? "text" : "password"}
                        className={style.inputClasse}
                        placeholder="Confirme sua Senha*"
                        value={confirmaSenha}
                        onChange={(e) => setConfirmaSenha(e.target.value)}
                        maxLength={30}
                    />
                    <img
                        src={iconeConfirmaSenha}
                        alt="ver senha"
                        className={style.imgSenha}
                        onClick={() => setMostrarConfimar(!mostrarConfimar)}
                    />
                </div>

                <BotoesForm
                    className={style.btnEnviar}
                    texto="Confirmar" 
                    onClick = {MudarSenha}  
                />
            </div>
        </div>
        </>
    )
}

export { ConteudoAlterarSenha }