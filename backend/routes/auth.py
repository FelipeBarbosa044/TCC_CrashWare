from fastapi import APIRouter, Depends,HTTPException
#Importando tabelas:
from models.usuarios import Usuarios
from models.usuarios_oauth import  UsuariosOauth
from models.patentes import Patente

#Instânciando roteador
auth = APIRouter(prefix="/auth",tags=["autenticação"])

#Importando session
from dependences import pegar_sessao

#Importando a CRIPTOGRAFIA
from security import criptografia

#Importando SHCEMAS:
from schemas.UsuarioSchema import UsuarioSchema

#Biblioteca que gera números aletórios:
from random import randint

#Biblioteca de tempo
from datetime import datetime ,timedelta , timezone

#Funções
def gerar_codigo():
    codigo = str(randint(100000,999999))
    expira_em = datetime.utcnow() + timedelta(minutes=10)


    return codigo , expira_em

#ROTAS:
@auth.post("/cadastro")
async def cadastro(dados : UsuarioSchema,session = Depends(pegar_sessao)):
    email = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if email is not None:
        raise HTTPException(status_code=400,detail="Esse email já foi cadastrado")
    else:
        codigo , expira = gerar_codigo()
        try:
            senha_criptografada = criptografia.hash(dados.senha)
            usuario_novo = Usuarios(nome=dados.nome.title(), email= dados.email , senha_hash= senha_criptografada,codigo = codigo, codigo_expirado_em = expira)
            session.add(usuario_novo)
            session.commit()
            return{
                "mensagem" : "Usuário cadastrado com sucesso!"
            }
        except Exception as exception:
            session.rollback()
            raise  exception


        
    