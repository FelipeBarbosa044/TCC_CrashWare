#Importando comandos do sql para o código.

from sqlalchemy import Column, Integer, String, Float


#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session



# Cria a sessão
session = Session()


class Patente(Base):
    __tablename__ = "patente"

    #Campos da tabela

    id_patente = Column(Integer,primary_key=True,autoincrement=True)
    nome_patente = Column(String(30),nullable=False)
    xp_minimo = Column(Float,nullable=False)

    # Criando atributos PARA O PYTHON (Naõ altera nada no banco de dados)
    def __init__(self,nome_patente,xp_minimo):
        self.nome = nome_patente
        self.xp_minimo = xp_minimo






session.close()

