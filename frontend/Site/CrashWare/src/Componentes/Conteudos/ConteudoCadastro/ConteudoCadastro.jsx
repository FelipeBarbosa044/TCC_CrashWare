import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BotoesForm, TIPO_BOTAO } from '../../Botoes';
import { CampoTexto } from '../../CampoTexto';

import esconderSenha_claro from '../../../fotos/claro/nao_pode_ver_senha.svg';
import verSenha_claro from '../../../fotos/claro/pode_ver_senha.svg';
import esconderSenha_escuro from '../../../fotos/escuro/nao_pode_ver_senha_claro.svg';
import verSenha_escuro from '../../../fotos/escuro/pode_ver_senha_claro.svg';

import style from './ConteudoCadastro.module.css';

/*Vocês vão começar a comentar o cod que dia? Vocês não tão fazendo um projeto qualquer não. */

//Nao, se vira

const ConteudoCadstro = () => {

    //useState sao as variaveis q guardamos as informações
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrar, setMostrar] = useState(false); 
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
    const [tema, setTema] = useState(localStorage.getItem('TemaSelecionado') || 'Claro');

    const [erros, setErros] = useState({
        nome: "",
        email: "",
        //telefone: "",
        senha: "",
        confirmarSenha: ""
    });

    useEffect(() => {
        const checarTema = (e) => setTema(e.detail);
        window.addEventListener('temaAtualizado', checarTema);
        return () => window.removeEventListener('temaAtualizado', checarTema);
    }, []);

    const isClaro = tema === 'Claro';
    const PodeMostarBotao = nome !== "" && email !== "" &&  senha !== "" && senha === confirmarSenha;

    const iconeSenha = mostrar
        ? (isClaro ? verSenha_claro      : verSenha_escuro)
        : (isClaro ? esconderSenha_claro : esconderSenha_escuro);

    const iconeConfirmarSenha = mostrarConfirmar
        ? (isClaro ? verSenha_claro      : verSenha_escuro)
        : (isClaro ? esconderSenha_claro : esconderSenha_escuro);


//Função que verifica se a string tem  número:
function temNumero(str) {
  return /\d/.test(str)
  //Retorna TRUE se tiver número OU FALSE se não tiver;
}

//Função que vai validar os dados e enviar para a API:
const handleCadastro = async () => {

    let novosErros = {
            nome: "",
            email: "",
            //telefone: "",
            senha: "",
            confirmarSenha: ""
        };

        let temErro = false;

        // Nome
        if (!nome.trim()) {
            novosErros.nome = "Preencha o nome";
            temErro = true;
        }else if(temNumero(nome) == true){
            novosErros.nome = "Nome inválido";
            temErro = true;
        }else if (nome.length < 5){
            novosErros.nome = "Digite pelo menos 5 caracteres";
            temErro = true;
        }
    

        // Email
        if (!email.trim()) {
            novosErros.email = "Campo obrigatório";
            temErro = true;
        } else if (!email.includes("@") || !email.includes(".")) {
            novosErros.email = "Email inválido";
            temErro = true;
        } 

        // Senha
        if (senha.length < 8) {
            novosErros.senha = "Senha muito curta";
            temErro = true;
        } else if (senha.includes(" ")){
            novosErros.senha = "Senha não pode ter espaço";
            temErro = true;
        }

        // Confirmar senha
        if (senha !== confirmarSenha) {
            novosErros.confirmarSenha = "Senhas não coincidem";
            temErro = true;
        } else if (confirmarSenha.includes(" ")){
            novosErros.confirmarSenha = "Senha não pode ter espaço";
            temErro = true;
        }

        setErros(novosErros);

        if (temErro) {
            // Se tiver erro, para aqui
            return;
        }else{
            try{
                const response = await fetch("https://api-crashware.onrender.com/auth/cadastro",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: 
                        JSON.stringify(
                            {
                                nome : nome.trim(),
                                email :  email.replace(/\s/g, "").toLowerCase(), //Tiro todos os espaços no meio.
                                senha: senha 
                            }
                        )
                });

                if (response.ok == false){
                    const erro = await response.json()
                    alert(erro.detail)
                    return
                } else{
                    const dados = await response.json();
                    alert(dados.mensagem)
                    //Vai para a página de VERIFICAR EMAIL.
                    //......
                }

            }
            catch (error) {
            console.log("Erro de conexão:", error);
            }
        }




};



    return (
       <> 
        <div className={style.corpo}>
            <div className={style.container}>
                <h1>Cadastre-se</h1>

                <CampoTexto 
                    type="text" 
                    maxLength={100} 
                    placeholder="Nome*" 
                    className={style.inputClasse} 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)}
                    autoComplete="new-password"
                />

                { erros.nome && <p className={style.erro}>{erros.nome}</p> }

                <CampoTexto 
                    type="email" 
                    maxLength={200} 
                    placeholder="E-mail*" 
                    className={style.inputClasse} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="new-password"
                />

                { erros.email && <p className={style.erro}>{erros.email}</p> }


                <div className={style.senhaWrapper}>
                    <CampoTexto 
                        type={mostrar ? "text" : "password"}
                        className={style.inputClasse} 
                        placeholder="Senha*" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                        maxLength={20}
                    />
                    <img 
                        src={iconeSenha}
                        alt="ver senha"
                        className={style.imgSenha}
                        onClick={() => setMostrar(!mostrar)}
                    />
                </div>

                { erros.senha && <p className={style.erro}>{erros.senha}</p> }

                <div className={style.senhaWrapper}>
                    <CampoTexto 
                        type={mostrarConfirmar ? "text" : "password"}
                        className={style.inputClasse} 
                        placeholder="Confirme sua Senha*" 
                        value={confirmarSenha} 
                        onChange={(e) => setConfirmarSenha(e.target.value)} 
                        maxLength={12}
                    />
                    <img 
                        src={iconeConfirmarSenha}
                        alt="ver confirmar senha"
                        className={style.imgSenha}
                        onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    />
                </div>

                { erros.confirmarSenha && <p className={style.erro}>{erros.confirmarSenha}</p> }

                <p className={style.TermosUso}>
                    Ao entrar no <span>CrashWare</span>, você concorda com os nossos termos e politicas de privacidade.
                </p>

                <BotoesForm 
                    texto="Cadastrar" 
                    tipo={TIPO_BOTAO.CADASTRO} 
                    className={style.btnCriarConta} 
                    // disabled={!PodeMostarBotao}
                    
                    //Chamando a função para enviar dados:
                    onClick={handleCadastro}
                />
                
                <div className={style.ou}>
                    <hr />
                    <p>OU</p>
                    <hr />
                </div>

                <Link to='/login'>
                    <BotoesForm 
                        texto="Entrar" 
                        tipo={TIPO_BOTAO.CADASTRO} 
                        className={style.btnCriarConta} 
                    />
                </Link>
            </div>
        </div>
        </>
    );
};

export { ConteudoCadstro };


//Código do telefone para utilizar depois:


/*     

const [telefone, setTelefone] = useState("");

                <CampoTexto 
                    type="tel" 
                    className={style.inputClasse}
                    placeholder="(00) 00000-0000*" 
                    value={telefone} 
                    onChange={handleTelefone}
                />
                
                { erros.telefone && <p className={style.erro}>{erros.telefone}</p> }


//Verificando erros:
// Telefone
        //Valida o telefoe para o banco de dados:
        const telefoneLimpo = telefone.replace(/\D/g, "");

        if (telefoneLimpo.length !== 11) {
            novosErros.telefone = "Telefone inválido";
            temErro = true;
        }


//Formatando o telefone:

const handleTelefone = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 7) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    setTelefone(v);
};
*/