from fastapi import APIRouter, Depends,HTTPException,UploadFile, File


#Importando comandos do sql para o código.
from sqlalchemy import delete, true

#Biblioteca de requesição
import requests


#Importando tabelas:
from models.usuarios import Usuarios
from models.usuarios_oauth import UsuariosOauth
from models.gamificacao import Patente, Usuario_Ofensiva
from routes.auth import auth

#Instânciando roteador
user = APIRouter(prefix="/user",tags=["usuario"])

#Importando dependencias
from dependences import pegar_sessao ,  validar_token

#Importano SCHEMAS
from schemas.GamificacaoSchema import RecursoSchema


#dotenv
import os
from dotenv import load_dotenv

#Datetime
from datetime import datetime, timedelta

##Carrego o .env
load_dotenv()

#Pego informações do banco:
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")
SUPABASE_BUCKET2 = os.getenv("SUPABASE_BUCKET2")


#ROTAS:
##Rota de coletar informações do usuario
@user.get('/')
async def  perfil(usuario = Depends(validar_token)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    else:
        nome_patente = usuario.patentes.nome_patente
        criado_em = usuario.created_at
        data_formatada = criado_em.strftime("%d/%m/%Y")
        return{
            "nome" : usuario.nome_usuario.title(),
            "email" : usuario.email.lower(),
            "telefone" : usuario.telefone,
            "foto" : usuario.foto,
            "banner" : usuario.banner,
            "moedas" : usuario.moedas,
            "xp" : usuario.xp,
            "ofensiva" : usuario.ofensiva,
            "ativo": usuario.ativo,
            "patente": nome_patente,
            "adm": usuario.admin,
            "criado_em" :  data_formatada
        }

######################
@user.delete('/deletar_conta')
async def deletar_conta(usuario = Depends(validar_token), session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    #Verifico se ele tem foto no bucket
    try:
        if usuario.foto != "default.png":
            ##Deleto a pasta que contem o id dele no bucket
            url_delete = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}"
            resposta = requests.delete(
                url_delete,
                headers={
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "prefixes": [usuario.foto]
                }
                )
            if (resposta.status_code > 199 and resposta.status_code < 300):
                pass
            else:
                raise HTTPException(status_code=400,detail=resposta.text)

            if usuario.banner != "default.png":
                ##Deleto a pasta que contem o id dele no bucket
                url_delete = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET2}"
                resposta = requests.delete(
                    url_delete,
                    headers={
                        "Authorization": f"Bearer {SUPABASE_KEY}",
                        "apikey": SUPABASE_KEY,
                        "Content-Type": "application/json"
                    },
                    json={
                        "prefixes": [usuario.banner]
                    }
                )
                if (resposta.status_code > 199 and resposta.status_code < 300):
                    pass
                else:
                    raise HTTPException(status_code=400, detail=resposta.text)


        session.query(Usuarios).filter(Usuarios.id_usuario == usuario.id_usuario).delete()
        session.commit()
        return {"mensagem": "Conta Deletada!"}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

##############

#Rota de desativar conta
@user.patch('/desativar_conta')
async def desativar_conta(usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    try:
        usuario.ativo = False
        session.commit()
        return {"mensagem" : "Conta Desativada"}
    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

#############

#Rota de adicionar foto
@user.post('/adicionar_foto')
async def adicionar_foto(foto : UploadFile = File(...), usuario = Depends(validar_token), session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    try:

        ##altero a foto no banco de dados:
        id = str(usuario.id_usuario) + '/'
        nome_arquivo = id + "foto"

        ##Gero uma nova imagem no bucket

        ##Gero uma requisição

        ##Pego a foto
        conteudo = await foto.read()

        ##URL DE UPLOAD
        url_upload = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{nome_arquivo}"

        #Headers da requisição
        headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "apikey": SUPABASE_KEY,
            "Content-Type": foto.content_type
        }

        #Requisição
        resposta = requests.post(
            url_upload,
            headers=headers,
            data=conteudo
        )

        if(resposta.status_code > 199 and resposta.status_code < 300):
            ##Retorno mensagem de sucesso
            usuario.foto = nome_arquivo
            session.commit()
            return {"mensagem": "Foto adicionada com sucesso!",
                    "foto": usuario.foto}
        else:
            ##Retorno o erro
            raise HTTPException(status_code=400,detail=resposta.text)

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


@user.put('/alterar_foto')
async def alterar_foto(foto : UploadFile = File(...), usuario = Depends(validar_token), session =  Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    try:
            #Removo a foto anterior

            ##Deleto a pasta que contem o id dele no bucket
            url_delete = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}"
            resposta = requests.delete(
                url_delete,
                headers={
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "prefixes": [usuario.foto]
                }
            )
            if (resposta.status_code > 199 and resposta.status_code < 300):
                ##Adiciono a foto no bucket

                #Trato o nome do arquivo


                #Pega extensão
                extensao = foto.filename.split(".")[-1]


                ##Evita cache
                tempo_atual = int(datetime.now().timestamp())
                ###
                id = str(usuario.id_usuario) + '/'
                nome_arquivo = f"{id}foto_{tempo_atual}.{extensao}"

                ##Gero uma requisição no bucket
                ##Pego a foto
                conteudo = await foto.read()

                ##URL Que vou mudar a foto
                url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{nome_arquivo}"


                resposta = requests.put(
                    url,
                    headers={
                        "Authorization": f"Bearer {SUPABASE_KEY}",
                        "apikey": SUPABASE_KEY,
                        "Content-Type": foto.content_type,
                    },
                    data=conteudo
                )

                if resposta.status_code > 199 and resposta.status_code < 300:
                    ##Se alterar foto der certo

                    ##Adiciono a foto no banco de dados
                    usuario.foto = nome_arquivo
                    session.commit()
                    return {
                            "mensagem" : 'Foto alterada com sucesso',
                            "foto" : usuario.foto
                            }
                else:
                    ##Retorno o erro
                    raise HTTPException(status_code=400, detail=resposta.text)

            else:
                ##Retorno o erro
                raise HTTPException(status_code=400, detail=resposta.text)

        
    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


@user.delete('/remover_foto')
async def remover_foto(usuario = Depends(validar_token), session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    try:
        if usuario.foto == 'default.png':
            raise HTTPException(status_code=404,detail="Foto não encontrada")
        else:
            ##Deleto a pasta que contem o id dele no bucket
            url_delete = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}"
            resposta = requests.delete(
                url_delete,
                headers={
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "prefixes": [usuario.foto]
                }
            )
            if (resposta.status_code > 199 and resposta.status_code < 300):
                usuario.foto = 'default.png'
                session.commit()
                return{
                    "mensagem" : "Foto removida com sucesso",
                    "foto" : usuario.foto
                }
            else:
                raise HTTPException(status_code=400, detail=resposta.text)
    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

##############
#Rota de adicionar Banner
@user.post('/adicionar_banner')
async def adicionar_banner(banner : UploadFile = File(...), usuario = Depends(validar_token), session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    try:
        ##altero o nome do banner
        id = str(usuario.id_usuario) + '/'
        nome_arquivo = id + "banner"

        ##Gero uma nova imagem no bucket

        ##Gero uma requisição

        ##Pego o banner
        conteudo = await banner.read()

        ##URL DE UPLOAD
        url_upload = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET2}/{nome_arquivo}"

        #Headers da requisição
        headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "apikey": SUPABASE_KEY,
            "Content-Type": banner.content_type
        }

        #Requisição
        resposta = requests.post(
            url_upload,
            headers=headers,
            data=conteudo
        )

        if(resposta.status_code > 199 and resposta.status_code < 300):
            ##Retorno mensagem de sucesso
            usuario.banner = nome_arquivo
            session.commit()
            return {"mensagem": "Banner adicionada com sucesso!",
                    "banner": usuario.banner}
        else:
            ##Retorno o erro
            raise HTTPException(status_code=400,detail=resposta.text)

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


###Rota de alterar Banner
@user.put('/alterar_banner')
async def alterar_banner(banner : UploadFile = File(...), usuario = Depends(validar_token), session =  Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    try:
            # Removo a foto anterior
            ##Deleto a pasta que contem o id dele no bucket

            url_delete = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET2}"
            resposta = requests.delete(
                url_delete,
                headers={
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "prefixes": [usuario.banner]
                }
            )
            if (resposta.status_code > 199 and resposta.status_code < 300):
                ##Adiciono o banner no bucket

                # Trato o nome do arquivo

                # Pega extensão
                extensao = banner.filename.split(".")[-1]

                ##Evita cache
                tempo_atual = int(datetime.now().timestamp())
                ###
                id = str(usuario.id_usuario) + '/'
                nome_arquivo = f"{id}banner_{tempo_atual}.{extensao}"

                ##Gero uma requisição no bucket
                ##Pego o banner
                conteudo = await banner.read()

                ##URL Que vou mudar o banner
                url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET2}/{nome_arquivo}"

                resposta = requests.put(
                    url,
                    headers={
                        "Authorization": f"Bearer {SUPABASE_KEY}",
                        "apikey": SUPABASE_KEY,
                        "Content-Type": banner.content_type,
                    },
                    data=conteudo
                )

                if resposta.status_code > 199 and resposta.status_code < 300:
                    ##Se alterar o  banner der certo

                    ##Adiciono a foto no banco de dados
                    usuario.banner = nome_arquivo
                    session.commit()
                    return {
                        "mensagem": 'Banner alterado com sucesso',
                        "banner": usuario.banner
                    }
                else:
                    ##Retorno o erro
                    raise HTTPException(status_code=400, detail=resposta.text)

            else:
                ##Retorno o erro
                raise HTTPException(status_code=400, detail=resposta.text)

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


##### Rota de remover banner
@user.delete('/remover_banner')
async def remover_banner(usuario = Depends(validar_token), session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    try:
        if usuario.banner == 'default.png':
            raise HTTPException(status_code=404, detail="Banner não encontrado")
        else:
            ##Deleto a pasta que contem o id dele no bucket
            url_delete = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET2}"
            resposta = requests.delete(
                url_delete,
                headers={
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "apikey": SUPABASE_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "prefixes": [usuario.banner]
                }
            )
            if (resposta.status_code > 199 and resposta.status_code < 300):
                #Se der certo a requisição:

                usuario.banner = 'default.png'
                session.commit()
                return{
                    "mensagem" : "Banner removido com sucesso",
                    "banner" : usuario.banner
                }
            else:
                raise HTTPException(status_code=400, detail=resposta.text)
    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))
#############

#Rota de ganhar XP
@user.post('/xp')
async def ganhar_xp(dados : RecursoSchema,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    if dados.xp == 0:
        return
    try:
        usuario.xp += dados.xp
        session.commit()
    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


#Rota de ganhar MOEDA
@user.post('/moeda')
async def ganhar_moeda(dados : RecursoSchema,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    if dados.moedas == 0:
        return
    try:
        usuario.moedas += dados.moedas
        session.commit()
    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

@user.post('/sicronizar_ofensiva')
async def sicronizar_ofensiva(usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    usuario_ofensiva = session.query(Usuario_Ofensiva).filter(Usuario_Ofensiva.id_usuario == usuario.id_usuario).first()
    if usuario_ofensiva is None:
        try:
            # Crio o vinculo do usuario com usuario_conquista
            ofensiva_usuario = Usuario_Ofensiva(usuario.id_usuario)
            session.add(ofensiva_usuario)

            ##Dou um dia de ofensiva para o usuario
            usuario.ofensiva += 1

            session.commit()
        except Exception as exception:
            ##Se não der certo eu retorno o erro, e dou rollback no banco.
            session.rollback()
            raise HTTPException(status_code=400, detail=str(exception))

    else:
        raise HTTPException(status_code=409,detail="Usuario ja sicronizado")


@user.post('/validar_ofensiva')
async def validar_ofensiva(usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    ##Verificar validade de ofensiva
    usuario_ofensiva = session.query(Usuario_Ofensiva).filter(Usuario_Ofensiva.id_usuario == usuario.id_usuario).first()

    if usuario_ofensiva  is None:
        raise HTTPException(status_code=404, detail="Ofensiva não encontrada")

    try:
        # Pego a ultima data atualizada da ofensiva do usuario
        ultima_data = usuario_ofensiva.ultima_data_valida

        # Pego a data atual
        data_atual = datetime.now()

        # Calculo quantos dias passou desde o ultimo dia em que o usuario ganhou a ofensiva
        dias_passados = (data_atual.date() - ultima_data.date()).days


        if dias_passados == 1:
            # Se a data for valida:
            usuario.ofensiva += 1
            usuario_ofensiva.ultima_data_valida = data_atual

        elif dias_passados > 1:
            # Reseto a ofensiva
            usuario.ofensiva = 1
            usuario_ofensiva.ultima_data_valida = data_atual

        # Calculo a maior ofensiva do usuario
        if usuario.ofensiva > usuario_ofensiva.maior_ofensiva:
            usuario_ofensiva.maior_ofensiva = usuario.ofensiva

        # Comito no banco de dados
        session.commit()

        return {
                "ofensiva": usuario.ofensiva,
                "maior_ofensiva": usuario_ofensiva.maior_ofensiva
            }

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))




























