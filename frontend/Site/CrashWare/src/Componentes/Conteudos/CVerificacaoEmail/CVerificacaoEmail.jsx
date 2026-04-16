import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CampoTexto } from "../../CampoTexto";
import { BotoesForm } from "../../Botoes";
import style from './CVerificacaoEmail.module.css'

const CVerificacaoEmail = () =>
{
    //useState que guardará a o codigo
    const [codigo, setCodigo] = useState("");

    //Receberá as informações da página anterior
    const location = useLocation();

    //Navegcao de páginas
    const Navegacao = useNavigate();

    //Pega os dados
    const mensagem = location.state?.mensagem;
    const email = location.state?.email;
    const nome =location.state?.nome;

    //Proteção da url
    useEffect(() => {
        if (!mensagem && !email) {
            Navegacao('/cadastro');
        }
    }, []);

    //Função de reenviar o código
    const ReenviarCodigo = async =>
    {
        //Timer de reenviar o código
        const [timer, setTimer] = useState(60);
        //Mensagem de loading
        const [loading, setLoading] = useState(false);

        useEffect(() => {
        if (timer === 0) return;
        
        const intervalo = setInterval(() =>{
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(intervalo);
        }, [timer]);

        //Daqui pra baixo é API
        async function handlerClick () {
            if(loading || timer > 0) return;

            setLoading(true);

            // try{
            //     const response = await fetch("https://api-crashware.onrender.com/auth/cadastro", {
            //         method: "POST",
            //         headers:{
            //             "Content-Type": "application/json"
            //         },
            //         body:
            //         JSON.stringify
            //     })
            // }


            // felipe betinha


        }
    }

const handleVericarEmail = async () => {
    try {
        const response = await fetch(
            "https://api-crashware.onrender.com/auth/verificar_email",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    codigo: codigo.toString(),
                    email: email
                })
            }
        );

        if (response.ok === false) {
            const erro = await response.json();

            // erro.detail
            alert("ERRO")
        } else {
            // Vai para LOGIN.
            alert("Código verificado e gabriel é um beta")
        }

    } catch (error) {
        console.log("Erro de conexão:", error);
    }
};


    //Verificara se pode liberar o botao
    // const PodeMostarBotao = email != " ";

    return(
        <>
            <div className={style.corpo}>
                <div className={style.container}>
                    <h1>Bem-Vindo {nome}!!!</h1>
                    <p className={style.texto}>Verifique o Código enviado para o email: {email} </p>

                    <CampoTexto type="number" maxLength={6} placeholder="Código" 
                        className={style.inputClasse} 
                        value={codigo} 
                        onChange={(e) => setCodigo(e.target.value)}
                    />

                    {/* <Link  to=""> */}
                        <BotoesForm texto="Verificar" className={style.btnEnviar}
                        onClick = {handleVericarEmail}
                        //disabled={!PodeMostarBotao}
                        />
                    {/* </Link> */}

                    <BotoesForm 
                    texto="Reenviar Email" className={style.btnEnviar}
                    onClick={ReenviarCodigo}
                    />
                </div>
            </div>
        </>
    )
}

//exportação da função
export { CVerificacaoEmail }