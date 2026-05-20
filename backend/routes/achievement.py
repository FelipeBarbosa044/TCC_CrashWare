from fastapi import APIRouter, Depends,HTTPException

##Importando Tabelas
from models.gamificacao import Conquista, Usuario_Conquista, session

#Instânciando roteador
achievement = APIRouter(prefix="/achievement",tags=["conquistas"])

#Importando dependencias
from dependences import pegar_sessao, validar_token

#Importando Schemas
from schemas.AchievementSchema import AchievementSchema


#ROTAS
@achievement.post('/')
async def achievement_login(dados : AchievementSchema,usuario = Depends(validar_token)):
    if usuario is None:
        raise HTTPException(status_code=404,detail="Usuário não encontrado")
    if dados.conquista_id is None:
        raise HTTPException(status_code=404, detail="Conquista_ID não encontrado")

    conquista_usuario = session.query(Usuario_Conquista).filter(Usuario_Conquista.usuario_id == usuario.id_usuario, Usuario_Conquista.conquista_id == dados.conquista_id).first()
    if conquista_usuario is None:
        try:
            ##Vinculo a conquista com o usuário
            usuario_conquista = Usuario_Conquista(dados.conquista_id,usuario.id_usuario)
            session.add(usuario_conquista)
            session.commit()

            conquista_usuario = session.query(Usuario_Conquista).filter(Usuario_Conquista.usuario_id == usuario.id_usuario,Usuario_Conquista.conquista_id == dados.conquista_id).first()

            return {
                "nome_conquista" : conquista_usuario.conquistas.nome_conquista,
                "descricao": conquista_usuario.conquistas.descricao,
                "tipo_conquista": conquista_usuario.conquistas.tipo_conquista,
                "moeda_bonus" : conquista_usuario.conquistas.moeda_bonus,
                "xp_bonus" : conquista_usuario.conquistas.xp_bonus
                    }
        except Exception as exception:
            ##Se não der certo eu retorno o erro, e dou rollback no banco.
            session.rollback()
            raise HTTPException(status_code=400, detail=str(exception))
            #####
    else:
        raise HTTPException(status_code=409,detail="Usuario já tem essa conquista...")






