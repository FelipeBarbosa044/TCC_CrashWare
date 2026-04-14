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

    id_usuario = Column(Integer,primary_key=True,autoincrement=True)
    nome_usuario = Column(String(100),nullable=False)
    email = Column(String(200),unique=True,nullable=False)
    telefone = Column(String(13),unique=True,nullable=True)
    senha_hash = Column(Text,nullable=True)
    foto = Column(String(255),default="default.png",server_default=text("'default.png'"))
    email_verificado = Column(Boolean,default=False,server_default=text("false"))
    ativo = Column(Boolean,default=True,server_default=text("true"))
    admin = Column(Boolean,default=False,server_default=text("false"))
    moedas = Column(Integer,default=0,server_default=text("0"))
    xp = Column(Integer,default=0,server_default=text("0"))
    patente_id = Column(Integer,ForeignKey("patente.id_patente"),nullable=False,default=1,server_default=text("1"))
    codigo = Column(String(6),nullable=True)
    codigo_expirado_em = Column(DateTime(timezone=True),nullable=True)


    #Data de criação e Data de Alteração

    created_at = Column(DateTime,server_default=func.now())
    updated_at = Column(DateTime,server_default=func.now(),onupdate=func.now())

    # Criando relação com objetos (relationship)
    oauths = relationship("UsuariosOauth",backref="usuarios")
    patentes = relationship("Patente",backref="usuarios")

    # Criando atributos PARA O PYTHON (Naõ altera nada no banco de dados)
    def __init__(self,nome_usuario,email,senha_hash,telefone = None,foto = 'default.png',email_verificado=False,ativo=True,admin=False,coin=0,xp = 0, patente_id = 1,codigo = codigo, codigo_expirado_em = codigo_expirado_em):
        self.nome_usuario = nome_usuario
        self.email = email
        self.telefone = telefone
        self.senha_hash = senha_hash
        self.foto = foto
        self.email_verificado = email_verificado
        self.ativo = ativo
        self.admin = admin
        self.coin = coin
        self.xp = xp
        self.patente_id = patente_id
        self.codigo = codigo
        self.codigo_expirado_em = codigo_expirado_em



#Fecho a sessão
session.close()