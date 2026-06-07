import { sleep } from "./functions";

export class Adm
{
    constructor(setPopup = null , Navegacao = null)
    {
        this.setPopup = setPopup;
        this.Navegacao = Navegacao;
    }

    async adicionar_conquista(nomeConquista,opcao,descricaoConquista,moedas,xp,condicao,setPopup)
    {
        setPopup({
                    tipo: 'aviso',
                    titulo: 'Conquista',
                    mensagem: 'Enviando Informações...'
                });

        await sleep(2000);

        

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/adm/adicionar_conquista",
            {   
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                        nome_conquista: nomeConquista,
                        tipo_conquista: opcao,
                        descricao : descricaoConquista,
                        moeda: moedas,
                        xp: xp,
                        condicao_conquista: condicao
                    })
            })

            if (response.ok)
            {
                const resposta = await response.json()
                
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Conquista',
                    mensagem: resposta.mensagem
                });

            }else
            {
                const erro = await response.json()

                  setPopup({
                    tipo: 'erro',
                    titulo: 'Erro',
                    mensagem: erro.detail
                });
            }   
        
        }catch(error) 
        {
             setPopup({
                    tipo: 'erro',
                    titulo: 'Erro De Conexão',
                    mensagem: 'Tente novamente mais tarde...'
                });
            //Erro de conexão
            console.log("Erro:", error);
            

        }//catch

    }//add_conquista


    async listar_conquista(setPopup)
    {
         setPopup({
                    tipo: 'aviso',
                    titulo: 'Conquistas',
                    mensagem: 'Listando conquistas...'
                });

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/adm/listar_conquista",
                 {
                    method: "GET"
                 });

        
            if (response.status == 204)
            {
                //Se não existir conquistas...

                //Pego o erro
                const erro = await response.json();

                setPopup({
                    tipo: 'erro',
                    titulo: 'Conquistas',
                    mensagem: erro.detail
                });

                 return;

            }else
            {
                //Se requisição der certo
                const resposta = await response.json();

                //Pego as conquistas
                const conquistas = await resposta.conquistas;

                //Guardo as conquistas no LocalStorage
                localStorage.setItem("conquistas", JSON.stringify(conquistas));

            }


        }catch(error) 
        {
             setPopup({
                    tipo: 'erro',
                    titulo: 'Erro De Conexão',
                    mensagem: 'Erro ao listar'
                });
            //Erro de conexão
            console.log("Erro:", error);
            

        }//catch
            
    }//Listar Conquistas

    async deletar_conquista(id_conquista,setPopup)
    {
        setPopup({
                    tipo: 'aviso',
                    titulo: 'Conquistas',
                    mensagem: 'Deletando conquista...'
                });

        sleep(1000)
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/adm/deletar_conquista",
                 {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_conquista : id_conquista
                        })
                 });


            if(response.ok)
            {
                //Exibo resposta da API
                const resposta = await response.json();
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Conquista',
                    mensagem: resposta.mensagem
                });

            }else
            {
                const erro = await response.json();

                //Exibo o erro
                
                setPopup({
                    tipo: 'erro',
                    titulo: 'Conquista',
                    mensagem: erro.detail
                });

               
            }

        }catch(error) 
        {
             setPopup({
                    tipo: 'erro',
                    titulo: 'Erro De Conexão',
                    mensagem: 'Erro ao deletar'
                });

            //Erro de conexão
            console.log("Erro:", error);

            sleep(1000)
            return;
        
        }//catch
    }//Deletar conquista



    //Total de usuários

    async carregar_usuarios(setPopup,setTotal = null)
    {
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/adm/buscar_usuarios",
                {
                    method: "GET"
                });


            if(response.ok)
            {
                //Exibo resposta da API
                const resposta = await response.json();
                
                const total = resposta.quantidade;

                const usuariosNaoAutenticados = resposta.naoAutenticados;

                const desativados = resposta.desativados;

                if (setTotal  != null)
                {
                    setTotal(total)
                }else
                {
                    //Pego as informações do usuarios
                    const usuarios = resposta.usuarios;

                    //Guardo os usuarios no LocalStorage
                    localStorage.setItem("usuarios", JSON.stringify(usuarios));
                }
                


            }else
            {
                const erro = await response.json();

                //Exibo o erro
                
                setPopup({
                    tipo: 'erro',
                    titulo: 'Erro Inesperado',
                    mensagem: "Tente Novamente Mais Tarde..."
                });

               console.log("Erro ao carregar  Usuários")
            }

        }catch(error) 
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: 'Usuarios',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro Ao Tentar Carregar Usuários" + error)

        
        }//catch
    }//Carregar Usuários

    async desativar_usuario(id_usuario,setPopup)
    {
        setPopup({
                    tipo: 'aviso',
                    titulo: 'Usuário',
                    mensagem: 'Desativando Usuário....'
                });

        await sleep(1000)
        try
        {
             const response = await fetch("https://api-crashware.onrender.com/adm/banir_usuario",
                {
                    method: "PATCH",
                    headers:{  "Content-Type": "application/json" },
                     body: JSON.stringify({
                        id_usuario : id_usuario
                    })

                });


            if(response.status == 409)
            {

                setPopup({
                    tipo: 'aviso',
                    titulo: 'Usuário',
                    mensagem: 'Usuário já está Desativado'
                });

                return;

            }
            if(response.ok)
            {
                //Exibo resposta da API
                const resposta = await response.json();
                
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Usuário',
                    mensagem: resposta.mensagem
                });
                
            }else
            {
                const erro = await response.json();

                //Exibo o erro
                
                setPopup({
                    tipo: 'erro',
                    titulo: 'Usuário',
                    mensagem: erro.detail
                });

               console.log("Erro ao Desativar  Usuários" + erro.detail)

               return 403
            }
                
        }catch(error) 
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: 'Erro ao Tentar Desativar Usuário',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro Ao Tentar Banir Usuário" + error)

    
        }
        
    }//Desativar Usuario

    async ativar_usuario(id_usuario,setPopup)
    {
         setPopup({
                    tipo: 'aviso',
                    titulo: 'Usuário',
                    mensagem: 'Ativando Usuário....'
                });

        await sleep(1000)
        try
        {
             const response = await fetch("https://api-crashware.onrender.com/adm/desbanir_usuario",
                {
                    method: "PATCH",
                    headers:{  "Content-Type": "application/json" },
                     body: JSON.stringify({
                        id_usuario : id_usuario
                    })

                });


            if(response.status == 409)
            {

                setPopup({
                    tipo: 'aviso',
                    titulo: 'Usuário',
                    mensagem: 'Usuário já está Ativado'
                });

                return;

            }
            if(response.ok)
            {
                //Exibo resposta da API
                const resposta = await response.json();
                
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Usuário',
                    mensagem: resposta.mensagem
                });
                
            }else
            {
                const erro = await response.json();

                //Exibo o erro
                
                setPopup({
                    tipo: 'erro',
                    titulo: 'Usuário',
                    mensagem: erro.detail
                });

               console.log("Erro ao Ativar  Usuário" + erro.detail)
            }
                
        }catch(error) 
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: 'Erro ao Tentar Ativar Usuário',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro Ao Tentar Desbanir Usuário" + error)

    
        }

    }//Ativar Usuário
    

    async removerFoto_usuario(id_usuario,setPopup)
    {
         setPopup({
                    tipo: 'aviso',
                    titulo: 'Foto',
                    mensagem: 'Removendo Foto...'
                });

        await sleep(1000)

        try
        {
             const response = await fetch("https://api-crashware.onrender.com/adm/removerFoto_usuario",
                {
                    method: "PATCH",
                    headers:{  "Content-Type": "application/json" },
                     body: JSON.stringify({
                        id_usuario : id_usuario
                    })

                });

            if(response.ok)
            {
                //Exibo resposta da API
                const resposta = await response.json();
                
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Foto',
                    mensagem: resposta.mensagem
                });
                
            }else
            {
                const erro = await response.json();

                //Exibo o erro
                
                setPopup({
                    tipo: 'erro',
                    titulo: 'Foto',
                    mensagem: erro.detail
                });

               console.log("Erro ao Remover foto do Usuário" + erro.detail)
            }
                
        }catch(error) 
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro Ao Tentar Remover Foto do Usuario" + error)

    
        }

    }//Remover Foto do Usuario

    async removerBanner_usuario(id_usuario,setPopup)
    {
         setPopup({
                    tipo: 'aviso',
                    titulo: 'Banner',
                    mensagem: 'Removendo Banner...'
                });

        await sleep(1000)

        try
        {
             const response = await fetch("https://api-crashware.onrender.com/adm/removerBanner_usuario",
                {
                    method: "PATCH",
                    headers:{  "Content-Type": "application/json" },
                     body: JSON.stringify({
                        id_usuario : id_usuario
                    })

                });

            if(response.ok)
            {
                //Exibo resposta da API
                const resposta = await response.json();
                
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Banner',
                    mensagem: resposta.mensagem
                });
                
            }else
            {
                const erro = await response.json();

                //Exibo o erro
                
                setPopup({
                    tipo: 'erro',
                    titulo: 'Banner',
                    mensagem: erro.detail
                });

               console.log("Erro ao Remover banner do Usuário" + erro.detail)
            }
                
        }catch(error) 
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro Ao Tentar Remover Banner do Usuario" + error)

    
        }

    }//Remover Banner do Usuario

    async redefinir_nome(id_usuario,setPopup,setDados)
    {
         setPopup({
                    tipo: 'aviso',
                    titulo: 'Nome',
                    mensagem: 'Redefinindo Nome...'
                });

        await sleep(1000)

        try
        {
             const response = await fetch("https://api-crashware.onrender.com/adm/redefinir_nome",
                {
                    method: "PATCH",
                    headers:{  "Content-Type": "application/json" },
                     body: JSON.stringify({
                        id_usuario : id_usuario
                    })

                });

            if(response.ok)
            {
                //Exibo resposta da API
                const resposta = await response.json();

                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Nome',
                    mensagem: resposta.mensagem
                });

                
            }else
            {
                const erro = await response.json();

                //Exibo o erro
                
                setPopup({
                    tipo: 'erro',
                    titulo: 'Nome',
                    mensagem: erro.detail
                });

               console.log("Erro ao Redefinir Nome" + erro.detail)

               return 403
            }
                
        }catch(error) 
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro Ao Tentar Rdefinir Nome" + error)

    
        }

    }//Redefinir Nome
    
}//ADM