#Importando comandos do sql para o código.

from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime,text,ForeignKey
from datetime import datetime

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session

# Cria a sessão
session = Session()

#Aqui eu uso comandos DDL (Data Definition Language)

class Usuarios(Base):
    #Nome da tabela
    __tablename__ = "usuario"

    #Campos da tabela

    id = Column(Integer,primary_key=True,autoincrement=True)
    nome = Column(String(100),nullable=False)
    email = Column(String(200),unique=True,nullable=False)
    telefone = Column(String(13),unique=True,nullable=True)
    senha_hash = Column(Text,nullable=True)
    email_verificado = Column(Boolean,default=False,server_default=text("false"))
    ativo = Column(Boolean,default=True,server_default=text("true"))
    admin = Column(Boolean,default=False,server_default=text("false"))
    moedas = Column(Integer,default=0,server_default=text("0"))
    xp = Column(Integer,default=0,server_default=text("0"))
    patente_id = Column(Integer,ForeignKey("patente.id"),nullable=False,default=1,server_default=text("1"))


    #Data de criação e Data de Alteração

    created_at = Column(DateTime,server_default=func.now())
    updated_at = Column(DateTime,server_default=func.now(),onupdate=func.now())

    # Criando relação com objetos (relationship)
    oauths = relationship("UsuariosOauth",backref="usuarios")
    patentes = relationship("Patente",backref="usuarios")

    # Criando atributos PARA O PYTHON (Naõ altera nada no banco de dados)
    def __init__(self,nome,email,telefone,senha_hash,email_verificado=False,ativo=True,admin=False,coin=0,xp = 0, patente_id = 1):
        self.nome = nome
        self.email = email
        self.telefone = telefone
        self.senha_hash = senha_hash
        self.email_verificado = email_verificado
        self.ativo = ativo
        self.coin = coin
        self.xp = xp
        self.patente_id = patente_id




#Fecho a sessão
session.close()