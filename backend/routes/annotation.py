#Ferramentas do FastApi
from fastapi import APIRouter, Depends,HTTPException

from datetime import timedelta

#Ferramentas do sqlAlchemy
from sqlalchemy import select,desc

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
        )
        .where(
            Anotacao.usuario_id == usuario.id_usuario
        )
        .order_by(
            desc(Anotacao.atualizado_em)
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

        #Ajusto a data
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



@annotation.patch('/editar_anotacao')
async  def editar_anotacao(dados : AnnotationSchema,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    try:
        anotacao = session.query(Anotacao).filter(Anotacao.id_anotacao == dados.id).first()

        if anotacao is None:
            raise HTTPException(status_code=404,detail="Anotação não encontrada")

        anotacao.titulo = dados.titulo
        anotacao.texto = dados.texto

        # Ajusto a data
        atualizado_em = anotacao.atualizado_em - timedelta(hours=3)

        session.commit()

        # Mensagem da API
        return {
            "mensagem": "Anotação Editada",
            "atualizado_em": atualizado_em.strftime("%d/%m/%Y")
        }

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


@annotation.delete('/deletar_anotacao')
async def deletar_anotacao(dados : AnnotationSchema , usuario = Depends(validar_token), session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    #Pego a anotação
    anotacao = session.query(Anotacao).filter(Anotacao.id_anotacao == dados.id).first()

    if anotacao is None:
        raise HTTPException(status_code=404, detail="Anotação não encontrada")

    try:
        # Deleto a conquista
        session.delete(anotacao)
        session.commit()

        return {"mensagem" : "Anotação Excluida"}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))












