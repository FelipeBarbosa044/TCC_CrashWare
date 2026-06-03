import { Api } from "./functions";

//Objeto que da classe Api
const usuario = new Api();

export class Annotation
{

    //Parâmetros do método construtor
    constructor(token = null,refresh_token = null, Navegacao = null,set = null)
    {
        this.token = token;
        this.refresh_token = refresh_token;
        this.Navegacao = Navegacao;
        this.set = set;
    }


    async buscar_anotacao(setPopup,setAnotacoes = null)
    {
        // setPopup({
        //         tipo: 'aviso',
        //         titulo: 'Anotações',
        //         mensagem: 'Buscando suas Anotações...'
        //     });

        //Verifico o token
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token");

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/annotation/",
            {
                method: "GET",
                headers : 
                {
                    "Authorization": `Bearer ${token}`
                }
            })

            if(response.ok)
            {
                //Requisição der certo
                const dados = await response.json();

                const anotacoes = dados.anotacoes

                if(setAnotacoes != null)
                {
                    setAnotacoes(anotacoes)
                }

            

            }else
            {
                //Requisição der errado
                const erro = await response.json();

                //Exibo na tela o erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Anotação',
                    mensagem: erro.detail
                });

                //Exibo no log o erro
                console.log("Erro Ao Tentar Buscar Anotação" + erro.detail)
            }

        }catch (error)
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: '',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro Ao Tentar Buscar Anotação" + error)
        }
    }

    async adicionar_anotacao(titulo,texto,setPopup)
    {
        //Verifico o token
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token");

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/annotation/adicionar_anotacao",
                {
                     method : "POST",
                     headers : 
                     {    
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                     },
                      body: JSON.stringify({
                        titulo: titulo,
                        texto: texto
                    })
                });

            if(response.ok)
            {
                //Requisição der certo
                const anotacao = await response.json();

                //Exibo na tela a resposta da API
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Anotação',
                    mensagem: anotacao.mensagem
                });

                return anotacao;

            }else
            {
                //Requisição der errado
                const erro = await response.json();

                //Exibo na tela o erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Anotação',
                    mensagem: erro.detail
                });

                //Exibo no log o erro
                console.log("Erro ao adicionar anotação" + erro.detail)
            }
        }catch(error)
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: 'erro',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao adicionar anotação" + error)
        }
    }//Adicionar anotação


    async editar_anotacao(titulo,texto,id,setPopup)
    {

         //Exibo a mensagem da API
                setPopup({
                    tipo: 'aviso',
                    titulo: 'Anotação',
                    mensagem: 'Editando Anotação...'
                });
                

        //Verifico o token
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token");

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/annotation/editar_anotacao",
            {
                method: "PATCH",
                headers : 
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify
                ({
                    titulo: titulo,
                    texto: texto,
                    id : id
                })
            })

            if(response.ok)
            {
                //Se requisição der certa

                //Pego o JSON
                const anotacao_atualizada = await response.json();

                //Exibo a mensagem da API
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Anotação',
                    mensagem: anotacao_atualizada.mensagem
                });
                

                //Retorno o JSON
                return anotacao_atualizada;

            }else
            {
                //Se requisição der erro
                const erro = await response.json();
        

                //Exibo na tela o erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Anotação',
                    mensagem: erro.detail
                });

                //Exibo no log o erro
                console.log("Erro ao Editar Anotação" + erro.detail) 
            }
        }catch (error)
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: 'erro',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao Editar Anotação" + error)
        }
    }


    async deletar_anotacao(id,setPopup)
    {
         //Exibo a mensagem da API
                setPopup({
                    tipo: 'aviso',
                    titulo: 'Anotação',
                    mensagem: 'Deletando Anotação...'
                });
                

        //Verifico o token
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token");


        try
        {
            const response = await fetch("https://api-crashware.onrender.com/annotation/deletar_anotacao",
            {
                method : "DELETE",
                headers:
                {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body : JSON.stringify
                ({
                    titulo: null,
                    texto: null,
                    id : id
                })
            })

            if(response.ok)
            {
                //Se requisição der certo

                const resposta = await response.json();

                //Exibo na tela o erro
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Anotação',
                    mensagem: resposta.mensagem
                });

                return true;

            }else
            {
                //Se requisição der erro
                const erro = await response.json();
        
                //Exibo na tela o erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Anotação',
                    mensagem: erro.detail
                });

                //Exibo no log o erro
                console.log("Erro ao Deletar Anotação" + erro.detail) 

                return false;
            }
        }catch(error)
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: 'erro',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao Deletar Anotação" + error)
        }
    }

}//Annotation