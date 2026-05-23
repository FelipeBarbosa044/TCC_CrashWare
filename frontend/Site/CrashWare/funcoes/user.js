import { Api, sleep } from "./functions";

export class Usuario
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

    async perfil(setDados)
    {
        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/user/",
                {
                    method: "GET",
                    headers:
                    {
                        "Authorization": `Bearer ${this.token}`
                    }
                })

            if(response.ok)
            {
                //Caso a requisiçaõ deu certo


                //Pego as informaçoes do usuario
                const dados = await response.json();

                //Aviso para o site, que essa requisição não será necessaria fazer mais de uma vez
                localStorage.setItem("info",true);

                //Guardo as informações do usuario no localstorage
                localStorage.setItem("dados", JSON.stringify(dados));

                setDados(dados)
            }
            else
            {
                const erro = await response.json()

                console.log(erro.detail)
            }
            
        }catch (error) 
        {
            console.log("Erro:", error);
            
            // this.setPopup({
            //     tipo: 'erro',
            //     titulo: 'Sem conexão',
            //     mensagem: 'Não foi possível conectar ao servidor.'
            // });

        }   
    }//Perfil


    async deletar_conta(setToken,setRefresh,setDados,setPopup)
    {

        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        setPopup({
                tipo: 'aviso',
                titulo: 'Conta',
                mensagem: 'Deletando conta...'
            });

        await sleep(2000)

        //Pego o token
        const token = localStorage.getItem("token")
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/user/deletar_conta",
                {
                    method: "DELETE",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                });

            if(response.ok)
            {

                //Deleto o token do LocalStorage
                await localStorage.removeItem("token");

                //Deleto o refresh_token do LocalStorage
                await localStorage.removeItem("refresh_token");

                //Deleto as informações do usuario do localStorage
                await localStorage.removeItem("dados");

                //Faço com que o site entenda que precisara buscar as informações denovo
                localStorage.setItem("info",false)


                //Faço com que o react renderize as informações
                setToken(null);
                setRefresh(null);
                setDados(null);
                

                //Levo para a tela inicial
                window.location.href = '/'
            }else
            {
                const erro = await response.json();
                
                setPopup({
                tipo: 'erro',
                titulo: 'Erro em deletar',
                mensagem: erro.detail
            });

            }
       
        }catch (error) 
        {
            
            setPopup({
                tipo: 'erro',
                titulo: 'Sem conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });
        }

    }//deletar_conta



    async adicionar_foto(conteudo,setFoto,setDados,setPopup)
    {
        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

        setPopup({
                tipo: 'aviso',
                titulo: 'Foto',
                mensagem: 'Adicionando Foto...'
            });

        await sleep(2000)
        
        try{
            const response = await fetch("https://api-crashware.onrender.com/user/adicionar_foto",
                {
                    method: "POST",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    },
                    body: conteudo
                });
            
            if(response.ok)
            {
                const resposta = await response.json();


                //Atualiza o setFoto
                setFoto(resposta.foto)

                //Atualizo no LocalStorage
                //Pega os dados atuais
                const dados = JSON.parse(localStorage.getItem("dados"));

                //Atualiza apenas a foto
                dados.foto = resposta.foto;

                //Salva novamente
                localStorage.setItem("dados", JSON.stringify(dados));

                //Atualiza a tela
                setDados(dados)

                
                setPopup({
                tipo: 'sucesso',
                titulo: 'Sucesso',
                mensagem: 'Foto adicionada com Sucesso...'
                });

                

            }else{
                const erro = await response.json();

                 setPopup({
                    tipo: 'erro',
                    titulo: 'Foto',
                    mensagem: erro.detail
                });

                
            }
        }catch (error) 
        {
            setPopup({
                tipo: 'erro',
                titulo: 'Sem conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });
        }
    }//Adicionar_Foto



    async alterar_foto(conteudo,setFoto,setDados,setPopup,setVersaoFoto)
    {
        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

         setPopup({
                tipo: 'aviso',
                titulo: 'Foto',
                mensagem: 'Alterando Foto...'
            });

        await sleep(2000)

        try
        {
             const response = await fetch("https://api-crashware.onrender.com/user/alterar_foto",
                {
                    method: "PUT",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    },
                    body: conteudo
                });

                if(response.ok)
                {
                    const resposta = await response.json();

                    //Atualizo o setFoto
                    setFoto(resposta.foto)

                    //Atualizo no LocalStorage:

                    //Pega os dados atuais
                    const dados = JSON.parse(localStorage.getItem("dados"));

                    //Atualiza apenas a foto
                    dados.foto = resposta.foto;

                    //Salva novamente
                    localStorage.setItem("dados", JSON.stringify(dados));

                    //Atualiza a tela
                    setDados(dados)

                    //Atualizo a versão nova da img para o site reconhecer
                    setVersaoFoto(Date.now())

                    
                    setPopup({
                        tipo: 'sucesso',
                        titulo: 'Sucesso',
                        mensagem: 'Foto alterada com Sucesso...'
                    });

                }else
                {
                    const erro = await response.json();

                    setPopup({
                        tipo: 'erro',
                        titulo: 'Foto',
                        mensagem: erro.detail
                    });
                }



        }catch (error) 
        {
              setPopup({
                    tipo: 'erro',
                    titulo: 'Erro',
                    mensagem: error
            });
        }
        
    }//Alterar Foto


    async remover_foto(setDados,setFoto,setPopup)
    {
        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

         setPopup({
                tipo: 'aviso',
                titulo: 'Foto',
                mensagem: 'Removendo foto...'
            });

        await sleep(2000)
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/user/remover_foto",
                {
                    method: "DELETE",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                });

            if(response.ok)
            {
                const  resposta = await response.json();

                setFoto(resposta.foto)

                //Atualizo no LocalStorage:

                //Pega os dados atuais
                const dados = JSON.parse(localStorage.getItem("dados"));

                //Atualiza apenas a foto
                dados.foto = resposta.foto;

                //Salva novamente
                localStorage.setItem("dados", JSON.stringify(dados));

                //Atualiza a tela
                setDados(dados)

                 setPopup({
                    tipo: 'sucesso',
                    titulo: 'Foto',
                    mensagem: resposta.mensagem
                });

            }else
            {
                const erro = await response.json();

                 setPopup({
                    tipo: 'erro',
                    titulo: 'Foto',
                    mensagem: erro.detail
                });

            }
        } catch (error) 
        {
            console.log("Erro na requisição:", error);

            setPopup({
                tipo: 'erro',
                titulo: 'Sem conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });
        }
        

    }//Remover Foto


     async adicionar_banner(conteudo,setBanner,setDados,setPopup)
    {
        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

        setPopup({
                tipo: 'aviso',
                titulo: 'Banner',
                mensagem: 'Adicionando Banner...'
            });

        await sleep(2000)
        
        try{
            const response = await fetch("https://api-crashware.onrender.com/user/adicionar_banner",
                {
                    method: "POST",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    },
                    body: conteudo
                });
            
            if(response.ok)
            {
                const resposta = await response.json();


                //Atualiza o setBanner
                setBanner(resposta.banner)

                //Atualizo no LocalStorage
                //Pega os dados atuais
                const dados = JSON.parse(localStorage.getItem("dados"));

                //Atualiza apenas a foto
                dados.banner = resposta.banner;

                //Salva novamente
                localStorage.setItem("dados", JSON.stringify(dados));

                //Atualiza a tela
                setDados(dados)

                
                setPopup({
                    tipo: 'sucesso',
                    titulo: 'Sucesso',
                    mensagem: 'Banner adicionado com Sucesso...'
                });

                

            }else{
                const erro = await response.json();

                

                 setPopup({
                    tipo: 'erro',
                    titulo: 'Banner',
                    mensagem: erro.detail
                });

                
            }
        }catch (error) 
        {
             setPopup({
                tipo: 'erro',
                titulo: 'Sem conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });
        }
    }//Adicionar_Banner


    
    async alterar_banner(conteudo,setBanner,setDados,setPopup,setVersaoBanner)
    {
        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

         setPopup({
                tipo: 'aviso',
                titulo: 'Banner',
                mensagem: 'Alterando Banner...'
            });

        await sleep(2000)

        try
        {
             const response = await fetch("https://api-crashware.onrender.com/user/alterar_banner",
                {
                    method: "PUT",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    },
                    body: conteudo
                });

                if(response.ok)
                {
                    const resposta = await response.json();

                    //Atualizo o setBanner
                    setBanner(resposta.banner)

                    //Atualizo no LocalStorage:

                    //Pega os dados atuais
                    const dados = JSON.parse(localStorage.getItem("dados"));

                    //Atualiza apenas o Banner
                    dados.banner = resposta.banner;

                    //Salva novamente
                    localStorage.setItem("dados", JSON.stringify(dados));

                    //Atualiza a tela
                    setDados(dados)

                    //Atualizo a versão nova da img para o site reconhecer
                    setVersaoBanner(Date.now())

                    
                    setPopup({
                        tipo: 'sucesso',
                        titulo: 'Sucesso',
                        mensagem: 'Banner alterado com Sucesso...'
                    });

                }else
                {
                    const erro = await response.json();

                    setPopup({
                        tipo: 'erro',
                        titulo: 'Erro',
                        mensagem: erro.detail
                    });
                }



        }catch (error) 
        {
            setPopup({
                        tipo: 'erro',
                        titulo: 'Erro',
                        mensagem: error
                    });
        }
       

    }//Alterar Banner

    async remover_banner(setDados,setBanner,setPopup)
    {
        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);
        
        //Pego o token
        const token = localStorage.getItem("token")

         setPopup({
                tipo: 'aviso',
                titulo: 'Banner',
                mensagem: 'Removendo Banner...'
            });

        await sleep(2000)
        try
        {
            const response = await fetch("https://api-crashware.onrender.com/user/remover_banner",
                {
                    method: "DELETE",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                });

            if(response.ok)
            {
                const  resposta = await response.json();

                setBanner(resposta.banner)

                //Atualizo no LocalStorage:

                //Pega os dados atuais
                const dados = JSON.parse(localStorage.getItem("dados"));

                //Atualiza apenas o banner
                dados.banner = resposta.banner;

                //Salva novamente
                localStorage.setItem("dados", JSON.stringify(dados));

                //Atualiza a tela
                setDados(dados)

                 setPopup({
                    tipo: 'sucesso',
                    titulo: 'Banner',
                    mensagem: resposta.mensagem
                });

            }else
            {
                const erro = await response.json();

                 setPopup({
                    tipo: 'erro',
                    titulo: 'Banner',
                    mensagem: erro.detail
                });

            }
        } catch (error) 
        {
            console.log("Erro na requisição:", error);

            setPopup({
                tipo: 'erro',
                titulo: 'Sem conexão',
                mensagem: 'Não foi possível conectar ao servidor.'
            });
        }
        

    }//Remover Banner


    async conquista(conquista_id,setPopupConquista,setDados)
    {
        //Verifico o token
        const usuario = new Api;
        usuario.Verificar_Token(this.token,this.refresh_token,this.Navegacao,this.set,true);

        //Pego o token
        const token = localStorage.getItem("token")

        try
        {
            const response = await fetch("https://api-crashware.onrender.com/achievement/",
                { 
                     
                    method: "POST",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body:  JSON.stringify({conquista_id})
                });

                if (response.status == 409)
                {
                    //Ignora
                    return;
                }

                if (response.ok)
                {
                    const dados = await response.json();

                    const nome_conquista = dados.nome_conquista;
                    const descricao = dados.descricao;
                    const tipo_conquista = dados.tipo_conquista;
                    const moeda_bonus = dados.moeda_bonus;
                    const xp_bonus = dados.xp_bonus;


                    if (moeda_bonus != 0)
                    {
                       //Adiciono moedas para a conta do usuario
                        await this.adicionar_moeda(moeda_bonus);
                    }
                    
                        
                    

                    if(xp_bonus != 0)
                    {
                        //adciono xp para conta do usuario
                        await this.adicionar_xp(xp_bonus);
                    }

                    

                    if(tipo_conquista == "Software")
                    {
                        //Popup do tipo "Software" aqui
                                setPopupConquista({
                                tipo: "software",
                                titulo: nome_conquista,
                                mensagem: descricao
                            });


                    }else if(tipo_conquista == "Hardware")
                    {

                        //Popup do tipo "Hardware" aqui
                          setPopupConquista({
                                tipo: "hardware",
                                titulo: nome_conquista,
                                mensagem: descricao
                            });


                    }else
                    {
                        //Popup do tipo "OUTRO" aqui
                        setPopupConquista({
                                tipo: "outros",
                                titulo: nome_conquista,
                                mensagem: descricao
                            });

                    }


                    // //Exibo essa conquista por enquanto...
                    //  setPopup({
                    //     tipo: 'sucesso',
                    //     titulo: nome_conquista,
                    //     mensagem: descricao
                    // });
                    
                }else
                {
                    const erro = await response.json();

                    console.log(erro.detail)
                }

            
        }catch (error) 
        {
            console.log(error);
        }
    }//Conquista

    async adicionar_xp(xp,setDados)
    {


         //Pego o token
        const token = localStorage.getItem("token")


         try
        {
            const response = await fetch("https://api-crashware.onrender.com/user/xp",
                { 
                     
                    method: "POST",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body:  JSON.stringify({xp})
                });


            if(!response.ok)
            {
                //Se a requisição não for sucedida
                const erro = await response.json();

                console.log(erro.detail)
            }else
            {
                //Requisição for bem sucedida

                //Pega os dados atuais
                const dados = JSON.parse(localStorage.getItem("dados"));

                //Atualizo o xp
                dados.xp = xp;

                //Salva novamente
                localStorage.setItem("dados", JSON.stringify(dados));
            }

        }catch (error) 
        {
            console.log(error);
        }


    }//adicionar_xp



    async adicionar_moeda(moedas,setDados)
    {

        

         //Pego o token
        const token = localStorage.getItem("token")


         try
        {
            const response = await fetch("https://api-crashware.onrender.com/user/moeda",
                { 
                     
                    method: "POST",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body:  JSON.stringify({moedas})
                });


            if(!response.ok)
            {
                //Se a requisição não for sucedida
                const erro = await response.json();

                console.log(erro.detail)
            }else
            {
                //Requisição for bem sucedida

                //Pega os dados atuais
                const dados = JSON.parse(localStorage.getItem("dados"));

                //Atualizo a moeda
                dados.moedas = moedas;

                //Salva novamente
                localStorage.setItem("dados", JSON.stringify(dados));
            }

        }catch (error) 
        {
            console.log(error);
        }


    }//adicionar_moeda

    async mostrar_conquista()
    {
        
        //Pego o token
        const token = localStorage.getItem("token")


        try
        {
            

            const response = await fetch("https://api-crashware.onrender.com/achievement/buscar_conquista",
                {
                    method: "GET",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                });
              
            if(response.ok)
            {
                //Pego os dados
                const dados = await response.json();

                //Pego as conquistas
                const conquistas = dados.conquistas

                //Guardo as conquistas no LocalStorage
                localStorage.setItem("usuario_conquistas", JSON.stringify(conquistas));

            }else
            {
                const erro = await response.json();

                console.log(erro.detail)
            } 
        }catch (error) 
        {
            //Erro de conexão
            console.log(error);
        }
    }//Mostrar Conquistas

}//classe