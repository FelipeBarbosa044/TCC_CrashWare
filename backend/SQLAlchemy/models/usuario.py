#Importando comandos do sql para o código.
from sqlalchemy import Column, Integer, String , UUID

#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session

# Cria a sessão
session = Session()

#Aqui eu uso comandos DDL (Data Definition Language)



#Fecho a sessão
session.close()