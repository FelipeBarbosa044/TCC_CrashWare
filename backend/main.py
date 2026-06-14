from fastapi import FastAPI
from routes.auth import auth
from routes.user import user
from routes.adm import adm
from routes.achievement import achievement
from routes.annotation import annotation
from routes.aula import materia
from routes.loja import  loja
import os #Acessa outros arquivos
from dotenv import load_dotenv # Le import arquivo .env
#CORS:
from fastapi.middleware.cors import CORSMiddleware



#Lendo arquivos .env
load_dotenv()

#Chave secreta
SECRET_KEY = os.getenv("SECRET_KEY")

ALGORITIMO = os.getenv("ALGORITIMO")

#API
crashware = FastAPI()

#CORS:

origins = [
    "https://crashware.onrender.com",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://localhost:5175",
    "http://localhost:5176"
]

crashware.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#Colocando as rotas dentro da API:
crashware.include_router(auth)

crashware.include_router(user)

crashware.include_router(adm)

crashware.include_router(achievement)

crashware.include_router(annotation)

crashware.include_router(materia)

crashware.include_router(loja)

#Alembic
#Crio uma migração
#alembic revision --autogenerate -m "nome da migração"

##Faço a migração acontecer no banco de dados
# alembic upgrade head

#Retorna para a primeira versão do Banco De Dados
#alembic downgrade base



#Server da API:
# uvicorn main:crashware --reload

