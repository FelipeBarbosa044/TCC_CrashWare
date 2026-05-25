##Importando tabelas

from models import Usuarios, UsuariosOauth, Patente


#Importando A conexao com o Banco de dados
from database.connection import engine

#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session

#Importando comandos do sql para o código.
from sqlalchemy import Column, String, Integer, update, true

# Cria a sessão
session = Session()

#Estrutura para comandos DML (Data Manipulation Language)
#try:
    #bloco
#except Exception as exception:
    #session.rollback()
    #raise  exception


try:
    pass
except Exception as exception:
    session.rollback()
    raise  exception



#Fecho a sessão
session.close()