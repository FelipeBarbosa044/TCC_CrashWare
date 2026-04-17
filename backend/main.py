from fastapi import FastAPI
from routes.auth import auth
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
    "http://127.0.0.1:5173"
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




#Server da API:
# uvicorn main:crashware --reload

