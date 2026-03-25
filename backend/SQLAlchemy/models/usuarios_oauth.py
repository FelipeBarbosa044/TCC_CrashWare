#Importando comandos do sql para o código.
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session


# Cria a sessão
session = Session()

#Aqui eu uso comandos DDL (Data Definition Language)

class UsuariosOauth(Base):
    # Nome da tabela
    __tablename__ = "usuarios_oauth"

    # Campos da tabela
    id = Column(Integer,primary_key=True,autoincrement=True)
    provider = Column(String(50),nullable=False) #Google ou GitHub
    provider_user_id = Column(String(255),nullable=False) #Id que o google ou github oferece.
    usuario_id = Column(Integer,ForeignKey("usuarios.id"),nullable=False)

    # Data de criação
    created_at = Column(DateTime,server_default=func.now())

    # Isso impede que o mesmo usuário do Google/GitHub seja vinculado a duas contas diferentes
    __table_args__ = (
        UniqueConstraint('provider', 'provider_user_id'),
    )

    #Criando atributos PARA O PYTHON (Naõ altera nada no banco de dados)
    def __init__(self,provider,provider_user_id,usuario_id):
        self.provider = provider
        self.provider_user_id = provider_user_id
        self.usuario_id = usuario_id


#Fecho a sessão
session.close()