from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy import select

#Importando tabelas:
from models.gamificacao import Conquista

#Importando SHCEMAS:
from schemas.admSchema import ConquistaSchema, DeletarConquistaSchema

#Instânciando roteador
adm = APIRouter(prefix="/adm",tags=["admnistração"])

#Importando dependencias
from dependences import pegar_sessao , validar_token



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









