from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy import select

#Importando tabelas:
from models.gamificacao import Conquista
from models.usuarios import Usuarios

#Importando SHCEMAS:
from schemas.admSchema import ConquistaSchema, DeletarConquistaSchema, UsuarioSchema

#dotenv
import os
from dotenv import load_dotenv

#Biblioteca de requisição
import requests

#Instânciando roteador
adm = APIRouter(prefix="/adm",tags=["adiministração"])

#Importando dependencias
from dependences import pegar_sessao , validar_token

##Carrego o .env
load_dotenv()

#Pego informações do banco e do bucket:
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")
SUPABASE_BUCKET2 = os.getenv("SUPABASE_BUCKET2")



@adm.post('/adicionar_conquista')
async def adicionar_conquista(conquista : ConquistaSchema,session = Depends(pegar_sessao)):
        try:
            ##Adiciono a conquista no banco de dados:
            conquista_nova = Conquista(conquista.nome_conquista, conquista.tipo_conquista, conquista.descricao,conquista.moeda,conquista.xp, conquista.condicao_conquista)
            session.add(conquista_nova)
            session.commit()

            ##Retorno mensagem de sucesso
            return {"mensagem" : "Conquista criada com sucesso!"}

        except Exception as exception:
            ##Se não der certo eu retorno o erro, e dou rollback no banco.
            session.rollback()
            raise HTTPException(status_code=400,detail=str(exception))


@adm.get('/listar_conquista')
async def listar_conquista(session = Depends(pegar_sessao)):
    ##Retorna os valores em dicionario dentro de uma lista.
    conquistas = session.execute(
        select(
            Conquista.id_conquista,
            Conquista.nome_conquista,
            Conquista.descricao,
            Conquista.tipo_conquista,
            Conquista.condicao_conquista
        )
    ).mappings().all()
    if not conquistas :
        raise HTTPException(status_code=204,detail="Não existe conquistas no banco de dados")
    return {"conquistas" : conquistas}


@adm.delete('/deletar_conquista')
async def deletar_conquista(dados : DeletarConquistaSchema ,session = Depends(pegar_sessao)):
    conquista = session.query(Conquista).filter(Conquista.id_conquista == dados.id_conquista).first()
    if conquista is None:
       raise HTTPException(status_code=404,detail="Conquista não encontrada")
    #Deleto a conquista
    session.delete(conquista)
    session.commit()

    ##Retorno a resposta
    return {"mensagem" : "Conquista deletada"}



@adm.get('/buscar_usuarios')
async def buscar_usuarios(session = Depends(pegar_sessao)):

    quantidade_usuarios = session.query(Usuarios).count()

    usuarios = session.execute(
        select(
            Usuarios.nome_usuario,
            Usuarios.created_at,
            Usuarios.id_usuario,
            Usuarios.updated_at,
            Usuarios.ativo
        )
        .order_by(Usuarios.id_usuario)
    ).mappings().all()

    #Pego a quantidade de

    #Usuários que não verificaram o email
    usuariosNaoAutenticados = session.query(Usuarios).filter(Usuarios.email_verificado == False).count()

    #Usuários que estão Desativados/Banidos
    usuariosDesativados = session.query(Usuarios).filter(Usuarios.ativo == False).count()



    return {
        "quantidade" : quantidade_usuarios,
        "usuarios" : usuarios,
        "naoAutenticados" : usuariosNaoAutenticados,
        "desativados" : usuariosDesativados
        }

@adm.patch('/banir_usuario')
async def banir_usuario(dados : UsuarioSchema ,session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.id_usuario == dados.id_usuario).first()
    if usuario is None:
       raise HTTPException(status_code=404,detail="Usuario não encontrado")
    if (usuario.ativo == False):
        raise HTTPException(status_code=409, detail="Usuario já está Desativado")

    if (usuario.email == "felipebarbosaribeiro197@gmail.com" or usuario.email == "resferagamer@gmail.com"):
        raise HTTPException(status_code=403, detail="O Felipe Não pode ser Desativado")

    # if usuario.admin == True:
    #     raise HTTPException(status_code=403, detail="Administradores Não pode ser Desativados")

    try:
        # Desativo o Usuario
        usuario.ativo = False
        usuario.motivo_banimento = dados.motivo_banimento.upper()
        session.commit()

        return {"mensagem": "Usuario Desativado"}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400,detail=str(exception))


@adm.patch('/desbanir_usuario')
async def desbanir_usuario(dados : UsuarioSchema ,session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.id_usuario == dados.id_usuario).first()
    if usuario is None:
       raise HTTPException(status_code=404,detail="Usuario não encontrado")
    if (usuario.ativo == True):
        raise HTTPException(status_code=409, detail="Usuario já está Ativo")
    try:
        # Desativo o Usuario
        usuario.ativo = True
        usuario.motivo_banimento = None
        session.commit()

        return {"mensagem": "Usuario Ativado"}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


@adm.patch('/removerFoto_usuario')
async def removerFoto_usuario(dados : UsuarioSchema ,session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.id_usuario == dados.id_usuario).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario não encontrado")

    if (usuario.foto == 'default.png'):
        raise HTTPException(status_code=404, detail="Usuário não tem foto!")

    if (usuario.email == "felipebarbosaribeiro197@gmail.com" or usuario.email == "resferagamer@gmail.com"):
        raise HTTPException(status_code=403, detail="O Felipe Não Pode ter a foto Removida")

    # if usuario.admin == True:
    #     raise HTTPException(status_code=403, detail="Administradores Não pode ter a Foto Removida")

    try:
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
            return {"mensagem": "Foto Removida"}
        else:
            raise HTTPException(status_code=400, detail=resposta.text)

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


@adm.patch('/removerBanner_usuario')
async def removerBanner_usuario(dados : UsuarioSchema ,session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.id_usuario == dados.id_usuario).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario não encontrado")

    if(usuario.banner == 'default.png'):
        raise HTTPException(status_code=404,detail="Usuário não tem banner!")

    if (usuario.email == "felipebarbosaribeiro197@gmail.com" or usuario.email == "resferagamer@gmail.com"):
        raise HTTPException(status_code=403, detail="O Felipe Não Pode ter o Banner Removido")

    # if usuario.admin == True:
    #     raise HTTPException(status_code=403, detail="Administradores Não pode ter from Banner Removido")

    try:
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
            # Se der certo a requisição:

            usuario.banner = 'default.png'
            session.commit()
            return {"mensagem": 'Banner Removido'}
        else:
            raise HTTPException(status_code=400, detail=resposta.text)

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

@adm.patch('/redefinir_nome')
async def redefinir_nome(dados : UsuarioSchema,session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.id_usuario == dados.id_usuario).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario não encontrado")

    if(usuario.nome_usuario == "Usuário"):
        raise HTTPException(status_code=403, detail="Esse Nome não pode ser Redefinido")

    if (usuario.email == "felipebarbosaribeiro197@gmail.com" or usuario.email == "resferagamer@gmail.com"):
        raise HTTPException(status_code=403, detail="O Felipe Não Pode ter o Nome Redefinido")

    try:
        usuario.nome_usuario = "Usuário"
        session.commit()

        return {"mensagem" : "Nome Redefinido"}
    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))















