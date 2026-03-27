import { useState } from 'react'
import style from "./pgcadastro.module.css";

const PgCadastro = () => {
    const [email, setEmail] = useState('')
    const [telefone, setTelefone] = useState('')
    const [senha, setSenha] = useState('')
    const [confirmarSenha, setConfirmarSenha] = useState('')
    const [erro, setErro] = useState('')

    const CriarConta = () => {
        if(senha != confirmarSenha){
            setErro('as senhas não são iguais!')
            return
        }
        setErro('')
    }

            return (
                <form autoComplete="off" readOnly>
                    <div className={style.container}> 
                        <h1>Cadastra-se</h1>

                        <input type="email" className={style.inputs}
                            placeholder="E-mail"
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} maxLength={120}
                        />

                        <input type="tel" className={style.inputs} placeholder="Nº de Telefone"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)} maxLength={11}
                        />

                        <input type="password" className={style.inputs} placeholder="Senha"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)} maxLength={12}
                        />

                        <input type="password" className={style.inputs} placeholder="Confirmar Senha"
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)} maxLength={12}
                        />

                        { erro && <p className={style.erro}>{erro}</p> }

                        <p className = {style.TermosUso}>Ao entrar no <span>CrashWare</span>, você concorda com os nossos termos e politicas de privacidade.</p>

                        <button type="button" className={style.btnCriarConta} onClick={CriarConta}>
                            Criar conta
                        </button>
                    </div>
                </form>
            );
        }

export { PgCadastro };