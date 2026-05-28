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
                mensagem: 'Desativando conta...'
            });

        sleep(1000);


        //Verifico o token
        const usuario = new Api;
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

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

                await sleep(2000);

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
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

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

    //Verificar Senha
    async Verificar_Senha(senha,email,setPodeNavegar,setPopup)
    {

        setPopup({
                tipo: 'aviso',
                titulo: 'Senha',
                mensagem: 'Verificando Senha...'
            });

        //Verifico o token
        const usuario = new Api();
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/auth/verificar_senha",
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        senha : senha
                    })
                });

                if(response.ok)
                {

                    //Controle de Navegação
                    localStorage.setItem("logout","true");


                    setPodeNavegar.current = true;
                    this.Navegacao("/alterar-senha",{
                        state:{
                            email: email.replace(/\s/g, "").toLowerCase()
                        }//state
                    })
                }else
                {
                    const erro = await response.json();

                    setPopup({
                        tipo: 'erro',
                        titulo: 'Senha',
                        mensagem: erro.detail
                    });
                }
            
        }catch(error){
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao verificar senha: " + error)
        }
    }//Verificar Senha

    //Verificar Telefone
    async Verificar_Telefone(telefone,email,setPopup,Navegacao)
    {
        setPopup({
                tipo: 'aviso',
                titulo: 'Telefone',
                mensagem: 'Verificando Telefone...'
            });

        //Verifico o token
        const usuario = new Api();
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/auth/verificar_telefone",
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        telefone : telefone
                    })
                });

            if (response.ok)
            {
                //Levo para a tela de verificar telefone

                Navegacao("/verificar-telefone",
                { state:
                    {    
                        telefone: telefone,
                        email : email
                    },
                        origem: "/configuracoes"
                });
            }else
            {
                const erro = await response.json();

                setPopup({
                    tipo: 'erro',
                    titulo: 'Telefone',
                    mensagem: erro.detail
                });

            }
                
            
        }catch(error){
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao Verificar Telefone: " + error)
        }

    }

    //Enviar SMS
    async Enviar_SMS(telefone,email,setPopup)
    {
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/auth/enviar_sms",
            {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        telefone : telefone,
                        email : email
                    })
           
            });

            if(response.ok)
            {
                //Bloqueio o botão por 10 minutos


                const resposta = await response.json();
                 setPopup({
                    tipo: 'sucesso',
                    titulo: 'SMS',
                    mensagem: resposta.mensagem
                });
                
            }else
            {
                const erro = await response.json();

                setPopup({
                    tipo: 'erro',
                    titulo: 'SMS',
                    mensagem: erro.detail
                });

                console.log(erro.detail)

            }
        } catch(error){
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao Enviar SMS : " + error)
        }
        
   
    }//Enviar SMS

    //Verificar SMS

    async Verificar_SMS(telefone,email,codigo,setPopup,Navegacao,setDados)
    {
         setPopup({
                tipo: 'aviso',
                titulo: 'Verificação',
                mensagem: 'Verificando Código...'
            });

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/auth/verificar_sms",
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        telefone : telefone,
                        email : email,
                        codigo : codigo
                    })
                });

            if (response.ok)
                {
                    const AddTelefone = localStorage.getItem("adicionar_telefone" , "true")

                    if(AddTelefone == "true")
                    {
                        //Chamo o método de adicionar telefone
                        await AddTelefone(telefone,email,setPopup,setDados,Navegacao)
                        return;
                    }

                    //Vai para alterar senha aqui
                    
                }
            
        }catch(error){
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao Verificar SMS : " + error)
        }
    }


    async Adicionar_Telefone(telefone,email,setPopup,setDados,Navegacao)
    {
        localStorage.setItem("adicionar_telefone" , "false")

         setPopup({
                tipo: 'aviso',
                titulo: 'Telefone',
                mensagem: 'Adicionando telefone...'
            });

        try
        {
            const  response = await fetch("https://api-crashware.onrender.com/auth/adicionar_telefone",
                {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        telefone : telefone,
                        email : email
                    })
                });

            if(response.ok )
            {

                //Atualizo no LocalStorage
                //Pega os dados atuais
                const dados = JSON.parse(localStorage.getItem("dados"));

                //Atualiza apenas o email
                dados.telefone = telefone;

                //Salva novamente
                localStorage.setItem("dados", JSON.stringify(dados));

                //Atualiza o setDados
                setDados(dados)

                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Telefone Adicionado',
                    mensagem: 'Estamos te redirecionando...'
                });

                sleep(2000)

                //Levo para a Home
                Navegacao('/home')
            }else
            {
                const erro = await response.json();

                setPopup({
                    tipo: 'erro',
                    titulo: 'Tente Mais Tarde...',
                    mensagem: erro.detail
                });
            }
            
        }catch(error){
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao adicionar telefone : " + error)
        }
    }//Adicionar Telefone


}//Configurações