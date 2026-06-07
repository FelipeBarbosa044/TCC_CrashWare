from sqlalchemy import Column, Integer, String, Float, text, DateTime, ForeignKey, Boolean, UniqueConstraint, false
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func

#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session




# Cria a sessão
session = Session()

#Tabela Item_Loja
class Item_Loja(Base):
    # Nome da Tabela
    __tablename__ = "item_loja"

    # Campos da tabela

    id_item = Column(Integer, primary_key=True, autoincrement=True)
    preco = Column(Integer,nullable=False)
    compravel_uma_vez = Column(Boolean,nullable=False,default=False, server_default=text("false"))

    def __init__(self,preco,compravel_uma_vez = False):
        self.preco = preco
        self.compravel_uma_vez = compravel_uma_vez


#Tabela Usuario_Item
class Usuario_Item(Base):
    # Nome da Tabela
    __tablename__ = "usuario_item"

    # Campos da tabela

    id_usuario_item = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id_usuario", ondelete="CASCADE"), nullable=False)
    item_id = Column(Integer,ForeignKey("item_loja.id_item",ondelete="CASCADE"), nullable=False)
    quantidade = Column(Integer,nullable=False,default=1, server_default=text("1"))
    equipado = Column(Boolean,nullable=False,default=False, server_default=text("false"))
    equipado_em = Column(DateTime, nullable=True)

    # Criando relação com objetos (relationship)
    usuario = relationship("Usuarios", backref=backref(
        "itens",
        cascade="all, delete-orphan",
        passive_deletes=True))


    loja = relationship("Item_Loja", backref=backref(
        "usuario_itens",
        cascade="all, delete-orphan",
        passive_deletes=True))

    def __init__(self,usuario_id,item_id,quantidade = 1,equipado = False,equipado_em = None):
        self.usuario_id = usuario_id
        self.item_id = item_id
        self.quantidade = quantidade
        self.equipado = equipado
        self.equipado_em = equipado_em



#Fecho a Sessão
session.close()