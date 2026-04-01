// importando componentes para ser ultilizados no ConteudoCadastro.jsx

import { Link } from 'react-router-dom';
import { useState } from 'react';
import { BotoesCadLogin, BotoesForm, TIPO_BOTAO } from '../../Botoes';
import { CampoTexto } from '../../CampoTexto';

// importando o estilo
import style from './ConteudoCadastro.module.css';

//Função que retorna o conteudo da pagina de cadastro
 
const ConteudoCadstro = () =>
{

    // guarda o valor de um campo enquanto o usuario digita:
        const [email, setEmail] = useState("");
        const [telefone, setTelefone] = useState("");
        const [senha, setSenha] = useState('');
        const [confirmarSenha, setConfirmarSenha] = useState('');

    // confirma se o input senha esta vazio ou igual aoconfirmar senha
        const PodeMostarBotao = senha != "" && senha === confirmarSenha;

    return (
        <div className={style.corpo}>

            <Link to="/login">
                <BotoesForm 
                    texto='Entre' 
                    tipo={TIPO_BOTAO.LOGIN} 
                    className={style.btncadastro}
                />
            </Link>

            <div className={style.container}>
                <h1>Cadastre-se</h1>

                <CampoTexto 
                    type="email" 
                    maxLength={120} 
                    placeholder="E-mail" 
                    className={style.inputClasse} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />

                <CampoTexto 
                    type="number" 
                    className={style.inputClasse}
                    placeholder="N° de Telefone" 
                    value={telefone} 
                    onChange={(e) => setTelefone(e.target.value)} 
                    maxLength={11}
                />

                <CampoTexto 
                    type="password" 
                    className={style.inputClasse} 
                    placeholder="Senha" 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)} 
                    maxLength={14}
                />
                
                <CampoTexto 
                    type="password" 
                    className={style.inputClasse} 
                    placeholder="Confirme sua Senha" 
                    value={confirmarSenha} 
                    onChange={(e) => setConfirmarSenha(e.target.value)} maxLength={14}
                />

                <p className = {style.TermosUso}>Ao entrar no <span>CrashWare</span>, você concorda com os nossos termos e politicas de privacidade.</p>

                <BotoesCadLogin 
                    texto="Cadastrar" 
                    tipo={TIPO_BOTAO.CADASTRO} 
                    className={style.btnCriarConta} 
                    disabled={!PodeMostarBotao}
                />
                
            </div>
        </div>
    );
};

// exporta a função 
export { ConteudoCadstro };