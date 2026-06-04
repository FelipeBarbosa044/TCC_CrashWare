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

    async contar_usuarios(setPopup,setTotal)
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
                
                const total = resposta.quantidade

                setTotal(total)


            }else
            {
                const erro = await response.json();

                //Exibo o erro
                
                setPopup({
                    tipo: 'erro',
                    titulo: 'Erro Inesperado',
                    mensagem: "Tente Novamente Mais Tarde..."
                });

               console.log("Erro ao contar Usuários" + erro)
            }

        }catch(error) 
        {
            //Erro de Internet OU na Requisição
            setPopup({
                tipo: 'erro',
                titulo: '',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro Ao Tentar Contar Usuários" + error)

            //Erro de conexão
            console.log("Erro:", error);
        
        }//catch
    }//Contar Usuários
    
}//classe