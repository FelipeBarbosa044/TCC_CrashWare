#Ferramentas do FastApi
from fastapi import APIRouter, Depends,HTTPException

#Ferramentas do sqlAlchemy
from sqlalchemy import select
from datetime import datetime, timezone, timedelta

#Importando Tabelas referente a LOJA
from models.loja import Item_Loja, Usuario_Item

#Instânciando roteador
loja = APIRouter(prefix="/loja",tags=["loja"])

#Importando dependencias
from dependences import pegar_sessao ,  validar_token

#Importando Schemas
from schemas.LojaSchema import ItemSchema

#ROTAS:
@loja.post('/')
async def comprar_item(dados : ItemSchema,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    if(usuario.moedas < dados.moedas):
        raise HTTPException(status_code=409, detail="Gemas Insuficientes")
    try:
        #Subtraio as gemas do usuário
        usuario.moedas -= dados.moedas

        if(dados.nome == "congelamento"):
            usuario.streak.congelamentos += 1

        if(dados.nome == "booster"):
            #Trato a data
            agora = datetime.utcnow()

            item = session.query(Usuario_Item).filter(Usuario_Item.usuario_id == usuario.id_usuario,Usuario_Item.item_id == 2).first()

            if item is None:
                booster = Usuario_Item(usuario_id=usuario.id_usuario,item_id=2,quantidade=1,equipado=True,equipado_em=agora)
                session.add(booster)
            else:
                item.quantidade += 1
                item.equipado_em = agora
                item.equipado  = True

        if (dados.nome == "gelo"):

            tema_gelo =  item = session.query(Usuario_Item).filter(Usuario_Item.usuario_id == usuario.id_usuario,Usuario_Item.item_id == 3).first()

            if tema_gelo is None:
                #Não foi comprado
                gelo =  Usuario_Item(usuario_id=usuario.id_usuario,item_id=3,quantidade=1,equipado=False,equipado_em=None)
                session.add(gelo)
            else:
                #Já foi comprado
                raise HTTPException(status_code=409, detail="Tema já Comprado")

        session.commit()


    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


@loja.get('/tema')
async def tema(usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    tema_gelo = session.query(Usuario_Item).filter(Usuario_Item.usuario_id == usuario.id_usuario , Usuario_Item.item_id == 3).first()

    booster = session.query(Usuario_Item.quantidade).filter(Usuario_Item.usuario_id == usuario.id_usuario,Usuario_Item.item_id == 2).scalar()

    congelamentos = session.query(Usuario_Item.quantidade).filter(Usuario_Item.usuario_id == usuario.id_usuario,Usuario_Item.item_id == 1).scalar()

    if booster is None:
        booster = 0

    if congelamentos is None:
        congelamentos = 0

    if tema_gelo is None:
        raise HTTPException(status_code=409, detail="Tema Não Comprado")
    else:
        return {"mensagem" : "Tema Comprado",
                "congelamentos" : congelamentos,
                "booster" : booster
                }





