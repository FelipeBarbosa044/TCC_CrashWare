import { Api } from "./functions";

export class Aula
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


    async criar_aula(descricaoAula,conteudoAula,questoes,moeda_bonus,xp_bonus,setPopup)
    {
       
        //Pego a descrição da Aula
        const titulo = descricaoAula[0];
        const tipo = descricaoAula[1];
        const modulo = descricaoAula[2];

        //Pego o conteudo da Aula
        const subtitulo1 = conteudoAula[0];
        const paragrafo1 = conteudoAula[1];
        const subtitulo2 = conteudoAula[2];
        const paragrafo2 = conteudoAula[3];
        const subtitulo3 = conteudoAula[4];
        const paragrafo3 = conteudoAula[5];
        const subtitulo4 = conteudoAula[6];
        const paragrafo4 = conteudoAula[7];

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/materia/",
            {
                method : "POST",
                headers: 
                    { 
                        "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                        titulo : titulo,
                        tipo: tipo,
                        modulo : modulo,
                        subtitulo1 : subtitulo1,
                        paragrafo1 : paragrafo1,
                        subtitulo2 : subtitulo2,
                        paragrafo2 : paragrafo2,
                        subtitulo3 : subtitulo3,
                        paragrafo3 : paragrafo3,
                        subtitulo4 : subtitulo4,
                        paragrafo4 : paragrafo4,
                        moeda_bonus : moeda_bonus,
                        xp_bonus : xp_bonus
                    })
            });

            if(response.ok)
            {
                //Pego a resposta
                const resposta = await response.json();

                //Pego o id_aula
                const id_aula = resposta.id_aula;

                //Crio Exercicio
                const aulaCriada = await this.criar_exercicio(id_aula,setPopup,questoes)

                if(aulaCriada == true)
                {
                     //Exibo PoPup de Sucesso
                    setPopup({
                        tipo: 'sucesso',
                        titulo: 'Aula',
                        mensagem: "Aula Criada"
                    });

                }
                
            }else
            {
                //Exibo Popup De Erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Aula',
                    mensagem: 'Erro ao criar Aula'
                });

            }
        }catch (error)
        {
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao Tentar Criar Aula : " + error)

            return false;
        }
    }//Criar Aula


    //Criar Exercicio 
    async criar_exercicio(id_aula,setPopup,questoes)
    {
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/materia/criar_exercicio",{
                method : "POST",
                headers: 
                    { 
                        "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                        aula_id : id_aula
                    })
            })

            if(response.ok)
            {
                //Pego a resposta
                const resposta = await response.json();

                //Pego o id_exercicio
                const id_exercicio = resposta.id_exercicio;

                for(let q = 0;q < questoes.length;q++)
                {
                    //Pego a pergunta
                    const pergunta = questoes[q].enunciado;

                    const ordem = q + 1

                    //Crio a Questao/Enunciado
                    const questaoCriada = await this.criar_questao(id_exercicio, pergunta, ordem, setPopup, questoes[q]);

                    if (questaoCriada == false)
                    {
                        return false
                    }

                }
                return true
            }else
            {
                const erro = await response.json();

                //Exibo PoPup de Erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Exercicio',
                    mensagem: 'Erro ao criar Exercício ' + erro.detail
                });

                //Exibo no log
                console.log(erro.detail)

                return false;
            }

        }catch (error)
        {
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao Tentar Criar Exercício : " + error)

            return false;
        }
    }//Criar Exercicio

    async criar_questao(id_exercicio,pergunta,ordem,setPopup,questao)
    {   
        try
        {
             const response = await fetch("https://api-crashware.onrender.com/materia/criar_questao",{
                method : "POST",
                headers: 
                    { 
                        "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                        exercicio_id : id_exercicio,
                        pergunta : pergunta,
                        ordem : ordem
                    })
            })

            if(response.ok)
            {
                //Pego a resposta
                const resposta = await response.json();

                //Pego o id_questao
                const id_questao = resposta.id_questao;


                for(let p = 1; p <= 5;p++)
                {
                    //Pego o texto
                    const texto = questao[`opcao${p}`];

                    //Retorna True se p for igual a 1
                    const correta = p == 1;

                    //Crio as Alternativas
                    const alternativaCriada = await this.criar_alternativa(id_questao,texto,correta,setPopup)

                    if(alternativaCriada == false)
                    {
                        return false;
                    }
                }

                return true

            }else
            {
                const erro = await response.json();

                //Exibo PoPup de Erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Questão',
                    mensagem: 'Erro ao criar Questão ' + erro.detail
                });

                //Exibo no log
                console.log(erro.detail)

                return false;
            }
        }catch (error)
        {
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao Tentar Criar Questão : " + error)

            return false;
        }
    }//Criar Questao


    async criar_alternativa(id_questao,texto,correta,setPopup)
    {
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/materia/criar_alternativa",{
                method : "POST",
                headers: 
                    { 
                        "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                        questao_id : id_questao,
                        texto : texto,
                        correta : correta
                    })
            })

            if(response.ok)
            {
                //Ignora
                return true;
            }else
            {
                 const erro = await response.json();

                //Exibo PoPup de Erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Alternativa',
                    mensagem: 'Erro ao criar Alternativa ' + erro.detail
                });

                //Exibo no log
                console.log(erro.detail)

                return false;
            }
        }catch (error)
        {
            //Erro na API ou de Conexão
            setPopup({
                tipo: 'erro',
                titulo: 'Erro De Conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });

            console.log("Erro ao Tentar Criar Alternativa : " + error)

            return false;
        }
    }


    async buscar_software()
    {
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/materia/buscar_software",{
                method : "GET"
            });

            if(response.ok)
            {
                //Requisição der certo

                const aulas =await response.json();

                return aulas

            }else
            {
                //Requisição der erro

                const erro = await response.json();

                console.log("Erro ao Buscar Matérias " + erro.detail)
            }

        }catch (error)
        {

            console.log("Erro ao Tentar Buscar Matérias : " + error)

        }

    }//Buscar aulas de SOFTWARE

    async buscar_hardware()
    {
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/materia/buscar_hardware",{
                method : "GET"
            });

            if(response.ok)
            {
                //Requisição der certo

                const aulas =await response.json();

                return aulas

            }else
            {
                //Requisição der erro

                const erro = await response.json();

                console.log("Erro ao Buscar Matérias " + erro.detail)
            }

        }catch (error)
        {

            console.log("Erro ao Tentar Buscar Matérias : " + error)

        }

    }//Buscar aulas de HARDWARE


    async SincronizarAula(id)
    {
         //Verifico o token
        const usuario = new Api();
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/materia/sincronizar_aula",
            {
                method : "POST",
                headers: 
                { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id : id
                })

            })

            if(response.status == 409)
            {
                //Ignora
                return;
            }
            if(response.ok)
            {
                //Ignora
                return;
            }else
            {
                const erro = await response.json();

                // console.log("Erro ao sincronizar aula" + erro.detail)
            }
        }catch(error){
            //Erro na API ou de Conexão
            // setPopup({
            //     tipo: 'erro',
            //     titulo: 'Erro De Conexão',
            //     mensagem: 'Não foi possível conectar ao servidor.'
            // });

            console.log("Erro ao Tentar Sincronizar aula : " + error)
        }

    }//Sincronizar Aula

    async SincronizarExercicio(id,setCarregando)
    {
         //Verifico o token
        const usuario = new Api();
        await usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/materia/sincronizar_exercicio",
            {
                method : "POST",
                headers: 
                { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id : id
                })

            })

            if(response.status == 409)
            {
                //Ignora
                
                const dados = await response.json();

                const acabou = dados.detail.terminou;

                if(acabou == true)
                {
                    //Usuario acabou os exercicios
                    setCarregando(true); //Bloque o botão de exercicios
                }else
                {
                    //Usuario não terminou os exercicios
                    setCarregando(false); //Deixo o botão liberado
                }
                return;
            }
            if(response.ok)
            {
                //Ignora
                return;
            }else
            {
                const erro = await response.json();

                // console.log("Erro ao sincronizar exercicio" + erro.detail)
            }
        }catch(error){
            //Erro na API ou de Conexão
            // setPopup({
            //     tipo: 'erro',
            //     titulo: 'Erro De Conexão',
            //     mensagem: 'Não foi possível conectar ao servidor.'
            // });

            console.log("Erro ao Tentar Sincronizar Exercicio : " + error)
        }

    }//Sincronizar Exercicio

}//Aula