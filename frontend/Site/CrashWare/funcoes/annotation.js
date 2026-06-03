import { Api } from "./functions";

//Objeto que da classe Api
const usuario = new Api();

export class Annotation
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


    async buscar_anotacao(setPopup)
    {
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

                //Guardo as informações do usuario no localstorage
                localStorage.setItem("anotacoes", JSON.stringify(dados.anotacoes));



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

    async adicionar_anotacao()
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
                        "Authorization": `Bearer ${token}`
                     }
                });

            if(response.ok)
            {
                //Requisição der certo
                const resposta = await response.json();



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
    }

}//Annotation