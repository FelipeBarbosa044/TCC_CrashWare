import { Api, SairDaConta, sleep } from "./functions";

export class Configurações
{


    //Parâmetros do método construtor
    constructor(token = null,refresh_token = null, Navegacao = null,set = null,setPopup = null)
    {
        this.token = token;
        this.refresh_token = refresh_token;
        this.Navegacao = Navegacao;
        this.set = set;
        this.setPopup = setPopup;
        
    }

    async desativar_conta(setPopup,setToken,setRefresh,setDados)
    {

        setPopup({
                tipo: 'aviso',
                titulo: 'Conta',
                mensagem: 'Deletando conta'
            });

        sleep(1000);


        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/user/desativar_conta",
                {
                    method : "PATCH",
                    headers : 
                    {
                        "Authorization": `Bearer ${token}`
                    }
                });

            if (response.ok)
            {
                const dados = await response.json();

                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Conta',
                    mensagem: dados.mensagem
                });

                sleep(2000);

                await SairDaConta(setToken,setRefresh,setDados);

                return;
            }else
            {
                const erro = await  response.json();

                setPopup({
                    tipo: 'erro',
                    titulo: 'Conta',
                    mensagem: "Erro ao desativar conta, tente novamente mais tarde.."
                });

                console.log(erro.detail)
            }
            
            
        }catch (error)
        {
             setPopup({
                tipo: 'erro',
                titulo: 'Sem conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log(error)
        }
    }//Desativar Conta
    
    async Validar_Email(email,setPopup)
    {

        //Verifico o token
        const usuario = new Api();
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

        try{
             const validarCampos = () => 
            {
                if (!email.trim()) {
                    return "Preencha o e-mail";
                }

                if (!email.includes("@") || !email.includes(".")) {
                    return "E-mail inválido";
                }


                return null;
            };

        const erro = validarCampos();

        if (erro) {
            setPopup({
                tipo: 'aviso',
                titulo: 'Erro no formulário',
                mensagem: erro
            });
            return;
        }

        setPopup({
            tipo: 'sucesso',
            titulo: 'Verificando informações...',
            mensagem: 'Estamos verificando seus dados'
        });

        await sleep(2000) /*-> Faz que espere 2 segundos*/

        const response = await fetch("https://api-crashware.onrender.com/auth/validar_email", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
             },
            body: JSON.stringify({
                email: email.replace(/\s/g, "").toLowerCase()
            })
        });

        if (!response.ok) {
            //Requisição der errado

            const erro = await response.json();

            setPopup({
                tipo: 'aviso',
                titulo: 'Email',
                mensagem: erro.detail 
            });

            return;
        }

        const resposta = await response.json();

        setPopup({
                tipo: 'sucesso',
                titulo: 'Verificação',
                mensagem: resposta.mensagem 
            });


        //Controle de Navegação
        localStorage.setItem("alterar_email","true")

        //Pego os dados do usuario no LocalStorage
        const dados = JSON.parse(localStorage.getItem("dados"));

        const email_antigo = dados.email;


        await sleep(2000)

        this.Navegacao("/verificacao-email", {
            state: {
                mensagem: dados.mensagem,
                email: email_antigo,
                email_novo: email.replace(/\s/g, "").toLowerCase(),
                origem: "/configuracoes"
            }
        });
    }catch(error){
        //Erro na API,ou erro na conexão

        
        setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao validar email: " + error)
    }

    }//Validar Email

    async Alterar_Email(email_novo,setPopup,setDados,Navegacao)
    {
        setPopup({
                tipo: 'aviso',
                titulo: 'Email',
                mensagem: 'Alterando email...'
            });

        await sleep(1000)

        //Controle de Navegação
        localStorage.setItem("alterar_email","false")


        //Pego o token
        const token = localStorage.getItem("token")

        try{
            const response = await fetch("https://api-crashware.onrender.com/auth/alterar_email", 
                {
                    method: "PATCH",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        email: null,
                        email_novo : email_novo.replace(/\s/g, "").toLowerCase()
                    })
                });

            if(response.ok)
            {
                //Se requisição dar correta
                const resposta = await response.json();

                setPopup({
                    tipo: 'sucesso',
                    titulo: 'email',
                    mensagem: resposta.mensagem

                });

                await sleep(2000)

                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Navegação',
                    mensagem: 'Estamos te redirecionando...'

                });

                //Atualizo no LocalStorage
                //Pega os dados atuais
                const dados = JSON.parse(localStorage.getItem("dados"));

                //Atualiza apenas o email
                dados.email = email_novo;

                //Salva novamente
                localStorage.setItem("dados", JSON.stringify(dados));

                //Atualiza o setDados
                setDados(dados)

                Navegacao('/home')

                return;

            }else
            {
                //Se a requisição der erro

                const erro = await response.json();


                setPopup({
                    tipo: 'erro',
                    titulo: 'Erro ao alterar email',
                    mensagem: 'Tente Novamente mais tarde...'

                });

                await sleep(2000)

                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Navegação',
                    mensagem: 'Estamos te redirecionando..'

                });


                Navegacao('/home')

                console.log("Erro ao alterar email " + erro.detail)

                return;
                
            }
        }catch(error){
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao alterar email: " + error)
        }

    }//Alterar email


}//Configurações