#Ferramentas do FastApi
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
        nova_anotacao = Anotacao(usuario.id_usuario,dados.titulo,dados.texto)
        session.add(nova_anotacao)
        session.commit()

        #Mensagem da API
        return {"mensagem":"Anotação Criada"}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))















