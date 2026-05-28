import { Configurações } from "./configurações";

/*Sleep*/
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Sair da conta
export async function SairDaConta(setToken,setRefresh,setDados){

     //Deleto o token do LocalStorage
    await localStorage.removeItem("token");

    //Deleto o refresh_token do LocalStorage
    await localStorage.removeItem("refresh_token");

    //Deleto as informações do usuario do localStorage
    await localStorage.removeItem("dados");

    //Faço com que o site entenda que precisara buscar as informações denovo
    localStorage.setItem("info",false)
    localStorage.setItem("logout",false)

    //Deleto o ID do LocalStorage
    // await localStorage.removeItem("id");

    //Faço com que o react renderize as informações
    setToken(null);
    setRefresh(null);
    setDados(null);
    // setId(null);

    
    //Levo para a tela inicial
    window.location.href = '/'

}

       


//Verifico qual tela a pessoa vai ir, ao clicar no "CRASHWARE" do HEADER
export function handleRedirect(Navegacao)
{
    //Pego os token dentro do escopo privado.
    const token = localStorage.getItem("token")

    if(!token)
    {
        //Levo para a tela Inicial
        Navegacao("/")
    }else
    {
        //Levo para home
        Navegacao("/home")
    }
}


//Classe API
export class Api
{
    constructor(nome = null , email = null, senha = null, popup = null, navegacao = null)
    {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.popup = popup;
        this.navegacao = navegacao;
    }

    async cadastrar(nome,email,senha,confirmarSenha,setPopup,Navegacao)
    {
        const validarCampos = () => 
        {

            if (!nome.trim()) {
                return "Preencha o nome";
            }

            if (/\d/.test(nome)) {
                return "Nome não pode conter números";
            }

            if (nome.length < 5) {
                return "Nome deve ter pelo menos 5 caracteres";
            }

            if (!email.trim()) {
                return "Preencha o e-mail";
            }

            if (!email.includes("@") || !email.includes(".")) {
                return "E-mail inválido";
            }

            if (senha.length < 8) {
                return "Senha deve ter pelo menos 8 caracteres";
            }

            if (senha.includes(" ")) {
                return "Senha não pode conter espaços";
            }

            if (senha !== confirmarSenha) {
                return "As senhas não coincidem";
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

        try {
            const response = await fetch("https://api-crashware.onrender.com/auth/cadastro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome_usuario: nome.trim(),
                    email: email.replace(/\s/g, "").toLowerCase(),
                    senha: senha
                })
            });

            if (!response.ok) {
                const erro = await response.json();

                setPopup({
                    tipo: 'aviso',
                    titulo: 'Email',
                    mensagem: erro.detail 
                });

                return;
            }

            const dados = await response.json();

            Navegacao("/verificacao-email", {
                state: {
                    mensagem: dados.mensagem,
                    nome: nome.toUpperCase(),
                    email: email.replace(/\s/g, "").toLowerCase(),
                    origem: "/cadastro"
                }
            });

            } catch (error) {
                    console.log("Erro:", error);

                    setPopup({
                        tipo: 'erro',
                        titulo: 'Sem conexão',
                        mensagem: 'Não foi possível conectar ao servidor.'
                    });
            }//catch

    }//método cadastro



    async Verificar_Email(email,setPopup,Navegacao)
    {
       
        //✅ VALIDAÇÃO DIRETA
        const validarCampos = () => {

        if (!email.trim()) {
            return "Preencha o e-mail";
        }

        if (!email.includes("@") || !email.includes(".")) {
            return "E-mail inválido";
        }

        return null;
        };
        const erro = validarCampos()

        if (erro)
        {
            setPopup({
                tipo: 'aviso',
                titulo: 'Erro no login',
                mensagem: erro
            });
            return;
        }else
        {
            setPopup({
                tipo: 'sucesso',
                titulo: 'Verificação',
                mensagem: 'Verificando Email..'
            });

            //Envio os dados para a API(na rota de verificar email)
            try {
                const response = await fetch("https://api-crashware.onrender.com/auth/verificar_email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.replace(/\s/g, "").toLowerCase()
                    })
            });//Parâmetros

                // Caso email não tiver autenticado
                if (!response.ok)
                {
                    const erro = await response.json()

                    setPopup({
                    tipo: 'erro',
                    titulo: 'Email',
                    mensagem: erro.detail
                    });

                }
                else{
                    // Sobrescreve valor no localStorage para controle de navegação

                    localStorage.setItem("rec_senha", "true")

                    //Levo para a tela de verificar codigo
                    Navegacao("/verificacao-email", {
                    state: {
                        email: email.replace(/\s/g, "").toLowerCase(),
                        origem: "/recuperar-senha" //origem da rota
                    } //State
                    } // 
                    )  //Navegação
                }
        } catch (error) 
            {
                //Precisa colocar esse erro no lugar certo davison.
                console.log(error);
                return;
            }
        }
    }


    async Verificar_Codigo(email,codigo,setPopup,setPodeNavegar,Navegacao,setDados,email_novo = null)
    {


        //  exibi um popup de aviso
        setPopup({
            tipo: 'aviso',
            titulo: 'Verificação de código',
            mensagem: 'Estamos verificando o código...'
        });

        await sleep(3000)  /*-> Faz com que espere 3 segundos*/

        //Requsição
            try {
                const response = await fetch(
                    "https://api-crashware.onrender.com/auth/verificar_codigo",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email,
                            codigo: codigo.toString()
                        })
                    }
                );

                if (response.ok === false) {

                    const erroCodigo = await response.json()

                    setPopup({
                        tipo: 'aviso',
                        titulo: '⚠️',
                        mensagem: erroCodigo.detail
                    });

                } else {

                    //Controle de navegação
                    const rec_senha = localStorage.getItem("rec_senha")

                    const alterar_email = localStorage.getItem("alterar_email")

                    if(email_novo == null)
                        setPopup({
                            tipo: 'sucesso',
                            titulo: 'Emal Verificado!',
                            mensagem: 'Estamos te redirecionando...'
                        });
                        await sleep(3000)  /*-> Faz que espere 3 segundos*/
                        

                    if(alterar_email == "true")
                    {
                        //Altero o email
                        const usuario = new Configurações();
                        usuario.Alterar_Email(email_novo,setPopup,setDados,Navegacao)

                    }else if (rec_senha == "false")
                    {
                        setPodeNavegar.current = true;
                        Navegacao("/login")
                        // , { replace: true }
                    }else
                    {
                        //Leva para a pag de rec_senha
                        setPodeNavegar.current = true;
                        Navegacao("/alterar-senha",
                        {
                        state:{
                            email: email.replace(/\s/g, "").toLowerCase()
                        }//state
                        })
                    }

                }

            } catch (error) {
                console.log("Erro de conexão:", error);

                setPopup({
                    tipo: 'erro',
                    titulo: 'Sem conexão',
                    mensagem: 'Não foi possível conectar ao servidor.'
                });
        }
    }



    async Enviar_Codigo(email,setPopup,loading,timer,setLoading,setTimer,setEnviarCodigo,email_novo = null)
    {


        if (loading || timer > 0) return;
        setLoading(true);
        setEnviarCodigo(true);
        try {
            const response = await fetch(
                "https://api-crashware.onrender.com/auth/reenviar_codigo",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        email_novo : email_novo
                    })
                }
            );

            if (!response.ok) {
                const erro = await response.json();
                
                //  exibi um popup de erro
                setPopup({
                    tipo: 'aviso',
                    titulo: '404',
                    mensagem: erro.detail
                });
            } else {
                setTimer(60);
                //Exibi um popup de sucesso
                    setPopup({
                    tipo: 'sucesso',
                    titulo: 'Código Enviado',
                    mensagem: 'Enviamos para seu email um código novo...'
                });

            }

        } catch (error) {
            console.log(error)
            setPopup({
                tipo: 'erro',
                titulo: 'Sem conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });
            
        } finally {
            setLoading(false);
        }
    }

    async Logar(email,senha,setPopup,Navegacao)
    {
        const validarCampos = () => {

            if (!email.trim()) {
                return "Preencha o e-mail";
            }

            if (!email.includes("@") || !email.includes(".")) {
                return "E-mail inválido";
            }

            if (!senha) {
                return "Preencha a senha";
            }

            if (senha.length < 8) {
                return "Senha deve conter pelo menos 8 caracteres";
            }

            return null;
        };

        const erro = validarCampos();

        if (erro) {
            setPopup({
                tipo: 'aviso',
                titulo: 'Erro no login',
                mensagem: erro
            });
            return;
        }

        setPopup({
            tipo: 'sucesso',
            titulo: 'Verificação',
            mensagem: 'Verificando dados...'
        });

        await sleep(2000) /*-> Faz que espere 2 segundos*/


        //Envio os dados para a API(na rota de login)
        try {
            const response = await fetch("https://api-crashware.onrender.com/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.replace(/\s/g, "").toLowerCase(),
                    senha: senha
                })
            });//Parâmetros

            // Erro causado por ação do usuário (dados inválidos, não autorizado, etc)

            if (response.status === 403) {
                //Caso o usuario não tenha verificado o email:

                //Controle de Navegação
                localStorage.setItem("rec_senha", "false")

                //Pego o nome
                const erro = await response.json()
                const nome = erro.detail.nome

                setPopup({
                    tipo: 'aviso',
                    titulo: 'Erro de autenticação',
                    mensagem: erro.detail.erro
                });


                await sleep(2000) /*Faz com que espere 2 segundos*/

                //Envio o usuario na pagina de verificar EMAIL
                Navegacao("/verificacao-email", {
                    state: {
                        email: email.toLowerCase(),
                        nome: nome.toUpperCase(),
                        origem: "/login"

                    }
                });



            } else if (!response.ok) {
                //Caso o usuario erre a senha, ou email não autenticado:

                //Retorna erro
                const erro = await response.json()
                setPopup({
                    tipo: 'aviso',
                    titulo: 'Erro de Autenticação',
                    mensagem: erro.detail
                });

                return;

            }

            else {
                // Usuario logou:

                //Pego o token gerado pela API
                const dados = await response.json()
                const token = dados.token
                const refresh_token = dados.refresh_token

                //Guardo no localStorage
                localStorage.setItem("token", token)
                localStorage.setItem("refresh_token", refresh_token)

                //Informações
                localStorage.setItem("info","false");

                //Caso eu queira pegar o token
                //const token = localStorage.getItem("token")
                //const refresh_token = localStorage.getItem("refresh_token")

                //Aqui envia para a tela de HOME:
                Navegacao("/home");
            }

        } catch (error) {
            console.log("Erro:", error);
            
            setPopup({
                tipo: 'erro',
                titulo: 'Sem conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });
        }
    }//Método login



    async Alterar_Senha(email,senha,confirmaSenha,setPopup,Navegacao,setToken,setRefresh,setDados)
    {

        const validarCampos = () => 
            {
                if (senha.length < 8) {
                    return "Senha deve ter pelo menos 8 caracteres";
                }

                if (senha.includes(" ")) {
                    return "Senha não pode conter espaços";
                }

                if (senha !== confirmaSenha) {
                    return "As senhas não coincidem";
                }

                return null;
            }
        //
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
                titulo: 'Senha',
                mensagem: 'Verificando senhas....'
        });


        await sleep(2000)/*Faz com que espere 2 segundos*/

        try 
        {
            const response = await fetch("https://api-crashware.onrender.com/auth/alterar_senha",
            {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
            })//Parâmetros

            if (!response.ok)
            {
                const erro = await response.json()

                setPopup({
                    tipo: 'aviso',
                    titulo: 'Senha',
                    mensagem: erro.detail
                });

            }else
            {
                const logout = localStorage.getItem("logout");


                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Senha atualizada com sucesso',
                    mensagem: 'Estamos te redirecionando...'
                });

                await sleep(2000) /* Faz com que espere 2 segundos*/

                if(logout == "true")
                {
                    //Deslogo ele da conta
                    await SairDaConta(setToken,setRefresh,setDados)
                    return;
                }

                Navegacao("/login");

            }

        }catch (error) 
        {   //Erro na requisição
            setPopup({
                tipo: 'erro',
                titulo: 'erro',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log(error)
        }
    }//Alterar_Senha

    async Verificar_Token(token,refresh_token,Navegacao,set = null,privado = null)
    {
        if(!token)
        {
            if(privado == true)
            {
                Navegacao("/")
                return;
            }else
            {
                //Ignora
                return;
            }
        }
        try {
            const response = await fetch("https://api-crashware.onrender.com/auth/verificar_token",
                {
                    method: "POST",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                })//

            if (!response.ok) {
                //Token se expirou ou token invalido!

                //Pego o erro
                const erro = await response.json();


                if(erro.detail == "Acesso Negado")
                {
                    //Coleto as variáveis do useState
                    const setToken = set[0];
                    const setRefresh = set[1];
                    const setDados = set[2];

                    //Saio da conta automaticamente
                    await SairDaConta(setToken,setRefresh,setDados);

                    return;
                }
                //Verifico o refresh_token
                await this.VerificarRefreshToken(refresh_token,Navegacao,privado,set)

                return;
                     
            }else 
            {
                if(privado == null)
                {
                    //Contabilizo os dias da ofensiva
                    // SicronizarOfensiva()

                    //Leva para a tela HOME 
                    Navegacao('/home');
                }
               
            }

        } catch (error) {
            //console.log(error)
        }
    }//Verifica Token
    


    async VerificarRefreshToken(refresh_token,Navegacao,privado,set)
    {
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/auth/verificar_refresh_token",
                {
                    method: "POST",
                    headers:
                    {
                        "Authorization": `Bearer ${refresh_token}`
                    }
                })//
            
            if (!response.ok) {
                //Refresh_Token se expirou ou Refresh_token invalido!

                if (privado == true)
                {
                    //Coleto as variáveis do useState
                    const setToken = set[0];
                    const setRefresh = set[1];
                    const setDados = set[2];

                    //Saio da conta automaticamente
                    await SairDaConta(setToken,setRefresh,setDados);


                    return;
                }
                //Continua na tela
                return;  
                        
            }else
            {
                //Refresh_Token valido

                //Faço um novo acess_token
                await this.Refresh_Token(refresh_token)

                if (privado == true)
                {
                    //Ignoro, deixo ele na tela que está
                }else{
                    //Levo para a tela HOME

                    Navegacao('/home')
                }
            }
        }catch (error) 
        {
            //console.log(error)
        }
         

    }//Verificar Refresh Token

    async Refresh_Token(refresh_token)
    {
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/auth/refresh_token",
                {
                    method: "POST",
                    headers:
                    {
                        "Authorization": `Bearer ${refresh_token}`
                    }
                })//

            if(response.ok)
            {
                //Novo token gerado com sucesso

                const dados = await response.json();

                const token = dados.token;

                //Guardo no localStorage
                localStorage.setItem("token", token)

                //Contabilizo os dias da ofensiva

            }
        }catch (error) 
        {
            //console.log(error)
        }
    }//Refresh Token





}//classe


