from sqlalchemy import Column, Integer,  String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func

#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session



# Cria a sessão
session = Session()

#Tabela Anotação
class Anotacao(Base):
    __tablename__ = "anotacao"

    id_anotacao = Column(Integer,primary_key=True,autoincrement=True)
    usuario_id = Column(Integer,ForeignKey("usuario.id_usuario",ondelete="CASCADE"),nullable=False)
    texto = Column(String(150),nullable=False)
    descricao = Column(Text,nullable=True)
    criado_em = Column(DateTime,server_default=func.now())
    atualizado_em = Column(DateTime,server_default=func.now(),onupdate=func.now())

    # Criando relação com objetos (relationship)
    usuario = relationship("Usuarios", backref=backref(
        "anotacoes",
        cascade="all, delete-orphan",
        passive_deletes=True))

    def __init__(self,usuario_id,titulo,texto):
        self.usuario_id = usuario_id
        self.titulo = titulo
        self.texto = texto



#Fecho a Sessão
session.close()