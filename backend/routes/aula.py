#Ferramentas do FastApi
from fastapi import APIRouter, Depends,HTTPException

#Ferramentas do sqlAlchemy
from sqlalchemy import select

from models import Usuarios
#Importando Tabelas referente as AULAS
from models.aula import Aula,Exercicio,Questao,Alternativa ,Usuario_Aula , Usuario_Exercicio

#Instânciando roteador
materia = APIRouter(prefix="/materia",tags=["matéria"])

#Importando dependencias
from dependences import pegar_sessao ,  validar_token

#Importando Schemas
from schemas.MateriaSchema import AulaSchema, ExercicioSchema, QuestaoSchema, AlternativaSchema, MateriaSchema

#Biblioteca Random:
from random import shuffle


#ROTAS:
#Rota de criar aula
@materia.post('/')
async def criar_aula(dados : AulaSchema,session = Depends(pegar_sessao)):
    try:
        #Crio a Aula
        aula = Aula(titulo= dados.titulo,tipo=dados.tipo,modulo=dados.modulo,subtitulo_1=dados.subtitulo1,paragrafo_1=dados.paragrafo1,subtitulo_2=dados.subtitulo2,paragrafo_2=dados.paragrafo2,subtitulo_3=dados.subtitulo3,paragrafo_3=dados.paragrafo3,subtitulo_4=dados.subtitulo4,paragrafo_4=dados.paragrafo4,moeda_bonus= dados.moeda_bonus,xp_bonus=dados.xp_bonus)
        session.add(aula)
        session.commit()

        return {"id_aula" : aula.id_aula}
    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

# Rota de criar Exercicio
@materia.post('/criar_exercicio')
async def criar_exercicio(dados : ExercicioSchema , session = Depends(pegar_sessao)):
    aula = session.query(Aula).filter(Aula.id_aula == dados.aula_id).first()
    if aula is None:
        raise HTTPException(status_code=404, detail="Aula não encontrada")
    try:
        #Crio o exercicio
        exercicio = Exercicio(aula_id= dados.aula_id)
        session.add(exercicio)
        session.commit()

        return {"id_exercicio" : exercicio.id_exercicio}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

# Rota de criar Questão
@materia.post('/criar_questao')
async def criar_questao(dados : QuestaoSchema , session = Depends(pegar_sessao)):
    exercicio = session.query(Exercicio).filter(Exercicio.id_exercicio == dados.exercicio_id).first()
    if exercicio is None:
        raise HTTPException(status_code=404, detail="Exercicio não encontrado")
    try:
        # Crio a Questão
        questao = Questao(exercicio_id=dados.exercicio_id,pergunta=dados.pergunta,ordem=dados.ordem)
        session.add(questao)
        session.commit()

        return {"id_questao": questao.id_questao}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

#Rota de Criar Alternativa
@materia.post('/criar_alternativa')
async def criar_alternativa(dados : AlternativaSchema,session = Depends(pegar_sessao)):
    questao = session.query(Questao).filter(Questao.id_questao == dados.questao_id).first()
    if questao is None:
        raise HTTPException(status_code=404, detail="Questão não encontrada")
    try:
        # Crio a Alternativa
        alternativa = Alternativa(questao_id=dados.questao_id,texto=dados.texto,correta=dados.correta)
        session.add(alternativa)
        session.commit()

        return {"mensagem" : "Alternativa Criada"}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


@materia.get('/buscar_aulas')
async def buscar_hardware(session = Depends(pegar_sessao)):
    aulas = session.execute(
        select(Aula.titulo,Aula.tipo, Aula.modulo,Aula.xp_bonus,Aula.xp_bonus)
    ).mappings().all()
    if not aulas:
        raise HTTPException(status_code=404, detail="Nenhuma Aula encontrada!")

    return {"aulas" : aulas}


@materia.post('/sincronizar_aula')
async def sincronizar_aula(dados : MateriaSchema ,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    aula_usuario = session.query(Usuario_Aula).filter(Usuario_Aula.usuario_id == usuario.id_usuario, Usuario_Aula.aula_id == dados.id).first()

    if aula_usuario is not None:
        raise HTTPException(status_code=409, detail="Aula Já Sincronizada")
    else:
        try:
            usuario_aula = Usuario_Aula(usuario_id= usuario.id_usuario,aula_id=dados.id,iniciou=True,terminou=False)
            session.add(usuario_aula)
            session.commit()

        except Exception as exception:
            ##Se não der certo eu retorno o erro, e dou rollback no banco.
            session.rollback()
            raise HTTPException(status_code=400, detail=str(exception))

@materia.post('/sincronizar_exercicio')
async def sincronizar_exercicio(dados : MateriaSchema , usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    exercicio_usuario = session.query(Usuario_Exercicio).filter(Usuario_Exercicio.usuario_id == usuario.id_usuario,Usuario_Exercicio.exercicio_id == dados.id).first()

    if exercicio_usuario is not None:
        if exercicio_usuario.terminou == True:
            raise HTTPException(status_code=409, detail={"terminou" : True})
        else:
            raise HTTPException(status_code=409, detail={"terminou": False})
    else:
        try:
            usuario_exercicio = Usuario_Exercicio(usuario_id=usuario.id_usuario,exercicio_id=dados.id,iniciou=True,terminou=False,questao_atual=1,acertos=0)
            session.add(usuario_exercicio)
            session.commit()

        except Exception as exception:
            ##Se não der certo eu retorno o erro, e dou rollback no banco.
            session.rollback()
            raise HTTPException(status_code=400, detail=str(exception))


@materia.post('/buscar_exercicios')
async def buscar_exercicios(dados : MateriaSchema,session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    questoes_lista = []

    questao_atual = session.query(Usuario_Exercicio.questao_atual).filter(Usuario_Exercicio.exercicio_id == dados.id,Usuario_Exercicio.usuario_id == usuario.id_usuario).scalar()


    # Pego as questões
    questoes = session.execute(
        select(Questao.id_questao, Questao.pergunta)
        .filter(Questao.exercicio_id == dados.id)
    ).mappings().all()

    for questao in questoes:
        # Pego as alternativas da questão atual
        alternativas = session.execute(
            select(Alternativa.texto, Alternativa.correta)
            .filter(Alternativa.questao_id == questao["id_questao"])
        ).mappings().all()

        # Transformo em lista normal e embaralho
        alternativas = [dict(alternativa) for alternativa in alternativas]
        shuffle(alternativas)

        # Retorno só pergunta e as alternativas
        questoes_lista.append({
            "pergunta": questao["pergunta"],
            "alternativas": alternativas
        })

    return {
        "questoes": questoes_lista,
        "questao_atual" : questao_atual
    }

@materia.patch('/progresso_exercicio')
async def progresso_exercicio(dados : MateriaSchema,session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario  is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    #Pego o exercicio do usuario
    exercicio_usuario = session.query(Usuario_Exercicio).filter(Usuario_Exercicio.usuario_id == usuario.id_usuario,Usuario_Exercicio.exercicio_id == dados.id).first()

    try:
        exercicio_usuario.questao_atual += 1

        if(dados.acertou == True):
            exercicio_usuario.acertos += 1

        session.commit()


    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


@materia.patch('/acabar_aula')
async def acabar_aula(dados : MateriaSchema, session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")


    #Pego o exercicio do usuario
    exercicio_usuario = session.query(Usuario_Exercicio).filter(Usuario_Exercicio.usuario_id == usuario.id_usuario,Usuario_Exercicio.exercicio_id == dados.id).first()

    aula_usuario = session.query(Usuario_Aula).filter(Usuario_Aula.usuario_id == usuario.id_usuario, Usuario_Aula.aula_id == dados.id).first()
    try:
        exercicio_usuario.terminou = True
        aula_usuario.terminou = True

        session.commit()
    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

@materia.post('/retornar_acertos')
async def retornar_acertos(dados : MateriaSchema,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    acertos = session.query(Usuario_Exercicio.acertos).filter(Usuario_Exercicio.exercicio_id == dados.id,Usuario_Exercicio.usuario_id == usuario.id_usuario).scalar()

    if acertos is None:
        return {"acertos": 0}

    return {"acertos" : acertos}


@materia.get('/aulas_concluidas')
async def aulas_concluidas(usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    aulas_concluidas = session.query(Usuario_Aula).filter(Usuario_Aula.usuario_id == usuario.id_usuario,Usuario_Aula.terminou == True).count()

    return {"aulas_concluidas" : aulas_concluidas}







