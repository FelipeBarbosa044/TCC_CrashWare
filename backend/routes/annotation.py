#Ferramentas do FastApi
from datetime import timedelta

from fastapi import APIRouter, Depends,HTTPException

#Ferramentas do sqlAlchemy
from sqlalchemy import select

#Importando Tabela Anotação
from models.annotation import Anotacao

#Instânciando roteador
annotation = APIRouter(prefix="/annotation",tags=["anotação"])

#Importando dependencias
from dependences import pegar_sessao ,  validar_token

#Importando Schemas
from schemas.AnnotationSchema import AnnotationSchema

#ROTAS:
@annotation.get('/')
async def buscar_anotacao(usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    #Busco as anotações
    anotacoes = session.execute(
        select(
            Anotacao.id_anotacao,
            Anotacao.titulo,
            Anotacao.texto,
            Anotacao.criado_em,
            Anotacao.atualizado_em
        ).where(
            Anotacao.usuario_id == usuario.id_usuario
        )
    ).mappings().all()

    #Retorno as anotações
    return {"anotacoes" : anotacoes}



@annotation.post('/adicionar_anotacao')
async def adicionar_anotacao(dados : AnnotationSchema,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    try:
        nova_anotacao = Anotacao(usuario_id= usuario.id_usuario,titulo = dados.titulo, texto= dados.texto)
        session.add(nova_anotacao)
        session.commit()
        session.refresh(nova_anotacao)

        #Formato as datas
        criado_em = nova_anotacao.criado_em - timedelta(hours=3)
        atualizado_em = nova_anotacao.atualizado_em - timedelta(hours=3)

        #Mensagem da API
        return {
                    "mensagem":"Anotação Criada",
                    "id" : nova_anotacao.id_anotacao,
                    "criado_em" : criado_em.strftime("%d/%m/%Y"),
                    "atualizado_em" : atualizado_em.strftime("%d/%m/%Y")
               }

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))















