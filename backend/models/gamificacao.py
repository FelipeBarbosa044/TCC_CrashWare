#Importando comandos do sql para o código.
from encodings.punycode import selective_find

from sqlalchemy import Column, Integer, Float, String, Text, ForeignKey, UniqueConstraint, DateTime, text, Boolean
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func

#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session



# Cria a sessão
session = Session()

#Tabela Patente
class Patente(Base):
    # Nome da tabela
    __tablename__ = "patente"

    # Campos da tabela
    id_patente = Column(Integer,primary_key=True,autoincrement=True)
    nome_patente = Column(String(30), nullable=False)
    xp_minimo = Column(Integer,nullable=False,default=0,server_default=text("0"))


    # Criando atributos PARA O PYTHON (Naõ altera nada no banco de dados)
    def __init__(self,nome_patente,xp_minimo = 0):
        self.nome_patente = nome_patente
        self.nivel_minimo = xp_minimo

#Tabela Conquista
class Conquista(Base):
    # Nome da tabela
    __tablename__ = "conquista"

    # Campos da tabela
    id_conquista = Column(Integer, primary_key=True, autoincrement=True)
    nome_conquista = Column(String(100), nullable=False)
    tipo_conquista = Column(String(50),nullable=False)
    descricao = Column(Text,nullable=False)
    moeda_bonus = Column(Integer, nullable=False)
    xp_bonus = Column(Float,nullable=False)
    condicao_conquista = Column(Text, nullable=False)

    # Criando atributos PARA O PYTHON (Naõ altera nada no banco de dados)
    def __init__(self,nome_conquista,tipo_conquista,descricao,moeda_bonus,xp_bonus,condicao_conquista):
        self.nome_conquista = nome_conquista
        self.tipo_conquista = tipo_conquista
        self.descricao = descricao
        self.moeda_bonus = moeda_bonus
        self.xp_bonus = xp_bonus
        self.condicao_conquista = condicao_conquista


#Tabela usuario_conquista
class Usuario_Conquista(Base):
    #Nome da tabela
    __tablename__ ="usuario_conquista"

    #Campos da tabela
    id_usuario_conquista = Column(Integer,primary_key=True,autoincrement=True)
    conquista_id = Column(Integer,ForeignKey("conquista.id_conquista",ondelete="CASCADE"),nullable=False)
    usuario_id = Column(Integer,ForeignKey("usuario.id_usuario",ondelete="CASCADE"),nullable=False)
    conquistada_em = Column(DateTime,server_default=func.now())

    #Isso impede de ter conquistas duplicadas para o usuario
    __table_args__ = (
        UniqueConstraint("usuario_id", "conquista_id"),
    )

    # Criando relação com objetos (relationship)
    conquistas = relationship("Conquista", backref=backref(
            "usuarios_conquistas",
            cascade="all, delete-orphan",
            passive_deletes=True))
    usuarios = relationship("Usuarios", backref=backref(
            "usuarios_conquistas",
            cascade="all, delete-orphan",
            passive_deletes=True))

    # Criando atributos PARA O PYTHON (Não altera nada no banco de dados)
    def __init__(self,conquista_id,usuario_id):
        self.conquista_id = conquista_id
        self.usuario_id = usuario_id



#Tabela usuario_ofensiva
class Usuario_Ofensiva(Base):
    __tablename__ = "usuario_ofensiva"

    #Campos da tabela
    id_usuario_ofensiva = Column(Integer,primary_key=True,autoincrement=True)
    id_usuario = Column(ForeignKey("usuario.id_usuario",ondelete="CASCADE"),nullable=False)
    maior_ofensiva = Column(Integer, default=1, server_default=text("1"))
    congelamentos = Column(Integer,default=0,server_default=text("0"))
    congelada_ativa = Column(Boolean,default=False,server_default=text("false"))
    ultima_data_valida = Column(DateTime,server_default=func.now())

    # Criando relação com objetos (relationship)
    usuario = relationship("Usuarios", backref=backref(
        "usuario_ofensiva",
        cascade="all, delete-orphan",
        passive_deletes=True))

    # Criando atributos PARA O PYTHON (Não altera nada no banco de dados)
    def __init__(self, id_usuario,maior_ofensiva=1,congelamentos = 0,congelada_ativa = False):
        self.id_usuario = id_usuario
        self.maior_ofensiva = maior_ofensiva
        self.congelamentos = congelamentos
        self.congelada_ativa = congelada_ativa









session.close()

