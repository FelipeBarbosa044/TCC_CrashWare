import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Style from "./ConteudoConfiguracoes.module.css";

//Importo o Popup
import { PopUp } from "../../pop-up";

import perfilModoClaro from "../../../fotos/claro/login_icon_claro.svg";
import perfilModoEscuro from "../../../fotos/escuro/login_icon.svg";

import sairContaModoClaro from "../../../fotos/claro/sairConta.svg";
import sairContaModoEscuro from "../../../fotos/escuro/sairConta.svg";

import desativarConta from "../../../fotos/desativarConta.svg";
import excluirConta from "../../../fotos/excluirConta.svg";

import sobreModoClaro from "../../../fotos/claro/Sobre.svg";
import sobreModoEscuro from "../../../fotos/escuro/Sobre.svg";

import termosModoClaro from "../../../fotos/claro/termos.svg";
import termosModoEscuro from "../../../fotos/escuro/termos.svg";

import googleIcon from "../../../fotos/google.png";
import githubIcon from "../../../fotos/github.png";
import { SairDaConta } from '../../../../funcoes/functions';
import { Usuario } from '../../../../funcoes/user';
import { Configurações } from '../../../../funcoes/configurações';
import { CampoTexto } from '../../CampoTexto';

const ItemBarraLateral = ({ descricao, img, onClick }) => {
    return (
        <div className={Style.itemBarraLateral} onClick={onClick}>
            <img src={img} alt={descricao} />
            <span>{descricao}</span>
        </div>
    );
};

const ConteudoConfiguracoes = () => {

    //State dos campos
    const [email, setEmailNovo] = useState("");
    const [telefone, setTelefone] = useState("");
    const [telefoneConfirmacao, setTelefoneConfirmacao] = useState("");

    //Formatar Telefone
    function formatarTelefone(valor) {

    valor = valor.replace(/\D/g, '');
    valor = valor.slice(0, 11);

    valor = valor.replace(
        /^(\d{2})(\d)/,
        '($1) $2'
    );

    valor = valor.replace(
        /(\d{1})(\d{4})(\d{4})$/,
        '$1 $2-$3'
    );
    return valor;
}

    // DESFORMATAR TELEFONE     FELIPE MEXER AQUI

    // const telefoneLimpo = telefone.replace(/\D/g, '');
    // const telefoneConfirmacaoLimpo = telefoneConfirmacao.replace(/\D/g, '');



    //Popup e visual
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');
    const [popupAtivo, setPopupAtivo] = useState(null); // null | 'sair' | 'desativar' | 'excluir'
    const [popup, setPopup] = useState(null);
    //Navegação --> Permite eu levar o usuario para outras telas
    const Navegacao = useNavigate();

    //Pego os tokens
    const token = localStorage.getItem("token");
    const refresh_token = localStorage.getItem("refresh_token");




    useEffect(() => {
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    const isClaro = tema === 'Claro';

    const [token_state, setToken] = useState(() => localStorage.getItem("token"));
    const [refresh_token_state, setRefresh] = useState(() => localStorage.getItem("refresh_token"));
    const [dados, setDados] = useState(() =>
        JSON.parse(localStorage.getItem("dados")) || null
    );

    //Lista que contém todos os usestate
    const set = [setToken, setRefresh, setDados];

    //Pego as informações do usuario
    const usuario = JSON.parse(localStorage.getItem("dados"));

    // Configurações de cada popup
    const configsPopup = {
        sair: {
            paragrafo: "Deseja sair da conta?",
            primeiroBotao: "Sair",
            segundoBotao: "Cancelar",
            primeiroClick: async () => {

                //Saio da Conta
                await SairDaConta(setToken, setRefresh, setDados, setPopup)



                setPopupAtivo(null);



            },
            segundoClick: () => setPopupAtivo(null),
        },
        desativar: {
            paragrafo: "Deseja desativar sua conta?",
            primeiroBotao: "Desativar",
            segundoBotao: "Cancelar",
            primeiroClick: () => { setPopupAtivo(null); },
            segundoClick: () => setPopupAtivo(null),
        },
        excluir: {
            paragrafo: "Deseja excluir sua conta? Essa ação é irreversível.",
            primeiroBotao: "Excluir",
            segundoBotao: "Cancelar",
            primeiroClick: async () => {

                setPopupAtivo(null);


                //Deleto a conta
                const user = new Usuario(
                    localStorage.getItem("token"),
                    localStorage.getItem("refresh_token"),
                    Navegacao,
                    set
                );
                await user.deletar_conta(setToken, setRefresh, setDados, setPopup)
            },
            segundoClick: () => setPopupAtivo(null),
        },
    };

    const conteudosBarraLateral = [
        { id: 1, descricao: "Alterar dados do perfil", img: perfilModoClaro, acao: null },
        { id: 2, descricao: "Sair da Conta", img: sairContaModoClaro, acao: 'sair' },
    ];

    const PopUpConfirmacao = ({ paragrafo, primeiroBotao, segundoBotao, primeiroClick, segundoClick }) => {
        return (
            <div className={`${Style.popUp} ${popupAtivo ? Style.popUpVisivel : ''}`}>
                <p>{paragrafo}</p>
                <div className={Style.botoes}>
                    <button onClick={primeiroClick} className={Style.primeiroBotao}>
                        {primeiroBotao}
                    </button>
                    <button onClick={segundoClick} className={Style.segundoBotao}>
                        {segundoBotao}
                    </button>
                </div>
            </div>
        );
    };

    const configAtual = popupAtivo ? configsPopup[popupAtivo] : null;

    if (!usuario) {
        return (
            <div className={Style.corpo} style={{ justifyContent: 'center' }}>
                <span style={{ color: '#8b90a0', letterSpacing: '0.1em', fontSize: '13px' }}>
                    CARREGANDO...
                </span>
            </div>
        );
    }

    //Validar Email
    const ValidarEmail = async () => {

        //Requisição de validar email
        const campo = new Configurações(token, refresh_token, Navegacao, set)
        await campo.Validar_Email(email, setPopup)
    }

    return (
        <>

            {/*Popup Padrão]*/}
            {popup && (
                <PopUp
                    tipo={popup.tipo}
                    titulo={popup.titulo}
                    mensagem={popup.mensagem}
                    onFechar={() => setPopup(null)}
                />
            )}


            {popupAtivo && (
                <div
                    className={Style.fundoEscurecido}
                    onClick={() => setPopupAtivo(null)}
                />
            )}

            <div className={Style.separarConteudos}>
                <div className={Style.barraLateral}>
                    <h1>Configurações de usuário</h1>
                    <hr />

                    <div className={Style.itensBarraLateral}>
                        {conteudosBarraLateral.map((item) => (
                            <ItemBarraLateral
                                key={item.id}
                                descricao={item.descricao}
                                img={item.img}
                                onClick={item.acao ? () => setPopupAtivo(item.acao) : undefined}
                            />
                        ))}

                        <div className={Style.destaque}>
                            <ItemBarraLateral
                                descricao="Desativar Conta"
                                img={desativarConta}
                                onClick={() => setPopupAtivo('desativar')}
                            />
                            <ItemBarraLateral
                                descricao="Excluir Conta"
                                img={excluirConta}
                                onClick={() => setPopupAtivo('excluir')}
                            />
                        </div>
                    </div>

                    <h1>Privacidade e Segurança</h1>
                    <hr />

                    <ItemBarraLateral
                        descricao={"Sobre"}
                        img={sobreModoClaro}
                    />
                    <Link to="/termos">
                        <ItemBarraLateral
                            descricao={"Termos de Serviço"}
                            img={termosModoClaro}
                        />
                    </Link>
                </div>

                <div className={Style.Conteudos}>
                    <h1>Dados do Perfil</h1>

                    <div className={Style.parteEmail}>
                        <div className={Style.campoForm}>
                            <label htmlFor="idEmailVinculado">E-mail vinculado</label>
                            <p>{usuario.email}</p>
                        </div>
                        <div className={Style.campoForm}>
                            <label htmlFor="idNovoEmail">Novo e-mail</label>
                            <input
                                type="email"
                                maxLength={200}
                                placeholder="E-mail*"
                                id='idNovoEmail'
                                value={email}
                                onChange={(e) => setEmailNovo(e.target.value)}
                                autoComplete='email'
                            />
                        </div>
                        <button className={Style.botoes} onClick={ValidarEmail}>Alterar</button>
                    </div>

                    <div className={Style.parteTelefone}>
                        <div className={Style.campoForm}>
                            <label htmlFor="idNumeroTel">Número de Telefone</label>

                            <CampoTexto type="text"
                                placeholder='xx-xxxxx-xxxx'
                                value={telefone}
                                onChange={(e) => setTelefone(
                                    formatarTelefone(e.target.value))} />
                        </div>

                        <div className={Style.campoForm}>

                            <label htmlFor="idConfirmeNumeroTel">Confirme o número de telefone</label>

                            <CampoTexto type="text"
                                placeholder='xx-xxxxx-xxxx'
                                id='idConfirmeNumeroTel'
                                value={telefoneConfirmacao}
                                onChange={(e) => setTelefoneConfirmacao(
                                    formatarTelefone(e.target.value))} />
                        </div>
                        <button className={Style.botoes}>Adicionar</button>
                    </div>

                    <div className={Style.alterarSenha}>
                        <p>Alterar senha atual</p>
                        <Link to="/recuperar-senha">
                            <button>Alterar</button>
                        </Link>
                    </div>

                    <div className={Style.conectarContas}>
                        <h2>Conecte suas contas para login</h2>
                        <div className={Style.imagens}>
                            <img src={googleIcon} alt="google" />
                            <img src={githubIcon} alt="github" />
                        </div>
                    </div>
                </div>
            </div>

            {configAtual && (
                <PopUpConfirmacao
                    paragrafo={configAtual.paragrafo}
                    primeiroBotao={configAtual.primeiroBotao}
                    segundoBotao={configAtual.segundoBotao}
                    primeiroClick={configAtual.primeiroClick}
                    segundoClick={configAtual.segundoClick}
                />
            )}
        </>
    );
};

export { ConteudoConfiguracoes };