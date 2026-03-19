import os
#importa o módulo que permite acessar variáveis de ambiente e interagir com o sistema operacional.

from dotenv import load_dotenv
#importa a função que carrega variáveis de um arquivo .env para o ambiente do Python.

from sqlalchemy import create_engine
#importa a função do SQLAlchemy usada para criar a conexão com o banco de dados.

load_dotenv() #Lê o arquivo .env e reconhece as variáveis dentro do arquivo .env

DATABASE_URL = os.getenv("DATABASE_URL") #Crio uma variável que recebe uma variável do .env

engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"}
) ##Crio a conexão com o banco de dados

