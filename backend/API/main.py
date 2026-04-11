from fastapi import FastAPI
from routes.auth import auth
import os #Acessa outros arquivos
from dotenv import load_dotenv # Le import arquivo .env

#Importando ferramentas para cirpotgrafia
from passlib.context import CryptContext
from passlib.handlers.bcrypt import bcrypt

#Chave secreta
SECRET_KEY = os.getenv("SECRET_KEY")

#API
crashware = FastAPI()


#Colocando as rotas dentro da API:
crashware.include_router(auth)

criptografia = CryptContext(schemes=["bcrypt"], deprecated = "auto")


#Server da API:
# uvicorn main:crashware --reload

