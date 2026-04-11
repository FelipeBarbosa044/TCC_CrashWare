from fastapi import APIRouter, Depends,HTTPException

#Importando tabelas:
from models import Usuarios
from models import  UsuariosOauth
from models import Patente

#Instânciando roteador
auth = APIRouter(prefix="/autenticação",tags=["autenticação"])

#Importando session
from dependences import pegar_sessao

#Importando a CRIPTOGRAFIA
from main import criptografia


#ROTAS:
@auth.post("/cadastro")
async def cadastro():
    return{"mensagem" : "Olá Mundo!"}