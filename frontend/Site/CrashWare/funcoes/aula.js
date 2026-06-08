export class Aula
{
    async criar_aula(titulo,tipo,modulo,subtitulo1,paragrafo1,subtitulo2,paragrafo2,subtitulo3,paragrafo3,subtitulo4,paragrafo4,moeda_bonus,xp_bonus,setPopup,questoes,alternativas)
    {
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
                await this.criar_exercicio(id_aula,setPopup)

                 //Exibo PoPup de Sucesso
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Aula',
                    mensagem: "Aula Criada"
                });

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
        }
    }//Criar Aula


    //Criar Exercicio 
    async criar_exercicio(id_aula,setPopup)
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

                //Pego o id_aula
                const id_exercicio = resposta.id_exercicio;

                //Crio  a Questao/Enunciado
                await this.criar_questao(id_exercicio,setPopup)
            }else
            {
                const erro = await response.json();

                //Exibo PoPup de Erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Exercicio',
                    mensagem: 'Erro ao criar Exercício' + erro.detail
                });

                //Exibo no log
                console.log(erro.detail)
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
        }
    }//Criar Exercicio

    async criar_questao(id_exercicio,pergunta,ordem,setPopup)
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

                //Pego o id_aula
                const id_questao = resposta.id_questao;

                //Crio as Alternativas
                await this.criar_alternativa(id_questao,setPopup)
            }else
            {
                const erro = await response.json();

                //Exibo PoPup de Erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Questão',
                    mensagem: 'Erro ao criar Questão' + erro.detail
                });

                //Exibo no log
                console.log(erro.detail)
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
        }
    }//Criar Questao


    async criar_alternativa(id_questao,setPopup)
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
                        questap_id : id_questao,
                        texto : texto,
                        correta : correta
                    })
            })

            if(response.ok)
            {
                //Ignora
                return;
            }else
            {
                 const erro = await response.json();

                //Exibo PoPup de Erro
                setPopup({
                    tipo: 'erro',
                    titulo: 'Alternativa',
                    mensagem: 'Erro ao criar Alternativa' + erro.detail
                });

                //Exibo no log
                console.log(erro.detail)
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
        }
    }
}//Aula