from sqlalchemy import Column, Integer, String, Float, text, Text, ForeignKey, Boolean , UniqueConstraint
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import func

#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session



# Cria a sessão
session = Session()

#Tabela Aula
class Aula(Base):
    #Nome da Tabela
    __tablename__ = "aula"

    # Campos da tabela
    id_aula = Column(Integer,primary_key=True,autoincrement=True)
    titulo = Column(String(50),nullable=False)
    tipo = Column(String(50),nullable=False)
    modulo = Column(Integer,nullable=False)

    subtitulo_1 = Column(String(70),nullable=False)
    paragrafo_1 = Column(Text,nullable= False)

    subtitulo_2 = Column(String(70), nullable=True)
    paragrafo_2 = Column(Text,nullable=True)

    subtitulo_3 = Column(String(70), nullable=True)
    paragrafo_3 = Column(Text,nullable=True)

    subtitulo_4 = Column(String(70), nullable=True)
    paragrafo_4 = Column(Text,nullable=True)

    moeda_bonus = Column(Integer, nullable=False)
    xp_bonus = Column(Float, nullable=False)

    # Criando atributos PARA O PYTHON (Não altera nada no banco de dados)
    def __init__(self,titulo,tipo,modulo,subtitulo_1,paragrafo_1,subtitulo_2 = None,paragrafo_2 = None,subtitulo_3 = None,paragrafo_3 = None,subtitulo_4 = None,paragrafo_4 = None,moeda_bonus = None,xp_bonus = None):
        self.titulo = titulo
        self.tipo = tipo
        self.modulo = modulo
        self.subtitulo_1 = subtitulo_1
        self.paragrafo_1 = paragrafo_1
        self.subtitulo_2 = subtitulo_2
        self.paragrafo_2 = paragrafo_2
        self.subtitulo_3 = subtitulo_3
        self.paragrafo_3 = paragrafo_3
        self.subtitulo_4 = subtitulo_4
        self.paragrafo_4 = paragrafo_4

        self.moeda_bonus = moeda_bonus
        self.xp_bonus = xp_bonus


#Tabela Usuario_Aula
class Usuario_Aula(Base):
    # Nome da Tabela
    __tablename__ = "usuario_aula"

    # Campos da tabela
    id_usuario_aula = Column(Integer,primary_key=True,autoincrement=True)
    usuario_id = Column(Integer,ForeignKey("usuario.id_usuario",ondelete="CASCADE"),nullable=False)
    aula_id = Column(Integer,ForeignKey("aula.id_aula",ondelete="CASCADE"),nullable=False)
    iniciou = Column(Boolean,nullable=False,default=False,server_default=text("false"))
    terminou = Column(Boolean, nullable=False, default=False, server_default=text("false"))

    # Evita duplicar a aula para o mesmo usuário
    __table_args__ = (
        UniqueConstraint("usuario_id", "aula_id", name="uq_usuario_aula"),
    )

    # Criando relação com objetos (relationship)
    usuarios = relationship("Usuarios", backref=backref(
        "aulas",
        cascade="all, delete-orphan",
        passive_deletes=True))

    aula = relationship("Aula", backref=backref(
        "status",
        cascade="all, delete-orphan",
        passive_deletes=True))

    # Criando atributos PARA O PYTHON (Não altera nada no banco de dados)
    def __init__(self,usuario_id,aula_id,iniciou = False,terminou = False):
        self.usuario_id = usuario_id
        self.aula_id = aula_id
        self.iniciou = iniciou
        self.terminou = terminou

#Tabela Exercicio
class Exercicio(Base):
    # Nome da Tabela
    __tablename__ = "exercicio"

    # Campos da tabela
    id_exercicio = Column(Integer, primary_key=True, autoincrement=True)
    aula_id = Column(Integer, ForeignKey("aula.id_aula", ondelete="CASCADE"), nullable=False,unique=True)

    # Criando relação com objetos (relationship)
    aula = relationship("Aula", backref=backref(
        "exercicio",
        cascade="all, delete-orphan",
        passive_deletes=True))

    # Criando atributos PARA O PYTHON (Não altera nada no banco de dados)
    def __init__(self,aula_id):
        self.aula_id = aula_id

#Tabela Questao
class Questao(Base):
    # Nome da Tabela
    __tablename__ = "questao"

    # Campos da tabela
    id_questao = Column(Integer, primary_key=True, autoincrement=True)
    exercicio_id = Column(Integer, ForeignKey("exercicio.id_exercicio", ondelete="CASCADE"), nullable=False)
    pergunta = Column(Text,nullable=False)
    ordem = Column(Integer,nullable=False)

    #Evita duplicar a ordem para cada usuário
    __table_args__ = (
        UniqueConstraint("exercicio_id", "ordem", name="uq_questao_ordem_exercicio"),
    )

    # Criando relação com objetos (relationship)
    exercicio = relationship("Exercicio", backref=backref(
        "questoes",
        cascade="all, delete-orphan",
        passive_deletes=True))

    # Criando atributos PARA O PYTHON (Não altera nada no banco de dados)
    def __init__(self,exercicio_id,pergunta,ordem):
        self.exercicio_id = exercicio_id
        self.pergunta = pergunta
        self.ordem = ordem

#Tabela Alternativa
class Alternativa(Base):
    # Nome da Tabela
    __tablename__ = "alternativa"

    # Campos da tabela
    id_alternativa = Column(Integer,primary_key=True,autoincrement=True)
    questao_id = Column(Integer,ForeignKey("questao.id_questao",ondelete="CASCADE"),nullable=False)
    texto = Column(Text,nullable=False)
    correta = Column(Boolean,nullable=False,default=False, server_default=text("false"))

 # Criando relação com objetos (relationship)
    questao = relationship("Questao", backref=backref(
        "alternativas",
        cascade="all, delete-orphan",
        passive_deletes=True))

    # Criando atributos PARA O PYTHON (Não altera nada no banco de dados)
    def __init__(self,questao_id,texto,correta = False):
        self.questao_id = questao_id
        self.texto = texto
        self.correta = correta


#Tabela Usuario_Exercicio
class Usuario_Exercicio(Base):
    # Nome da Tabela
    __tablename__ = "usuario_exercicio"

    # Campos da tabela
    id_usuario_exercicio = Column(Integer,primary_key=True,autoincrement=True)
    usuario_id = Column(Integer,ForeignKey("usuario.id_usuario",ondelete="CASCADE"),nullable=False)
    exercicio_id = Column(Integer,ForeignKey("exercicio.id_exercicio",ondelete="CASCADE"),nullable=False)
    iniciou = Column(Boolean,nullable=False,default=False, server_default=text("false"))
    terminou = Column(Boolean,nullable=False,default=False, server_default=text("false"))
    questao_atual = Column(Integer,nullable=False,default=1, server_default=text("1"))
    acertos = Column(Integer,nullable=False,default=0, server_default=text("0"))

    #Evita Duplicar exercicios repetidos para o usuário
    __table_args__ = (
        UniqueConstraint("usuario_id", "exercicio_id", name="uq_usuario_exercicio"),
    )

    # Criando relação com objetos (relationship)
    usuario = relationship("Usuarios", backref=backref(
        "exercicios",
        cascade="all, delete-orphan",
        passive_deletes=True))

    exercicio = relationship("Exercicio", backref=backref(
        "usuarios_exercicios",
        cascade="all, delete-orphan",
        passive_deletes=True))

    # Criando atributos PARA O PYTHON (Não altera nada no banco de dados)
    def __init__(self,usuario_id,exercicio_id,questao_atual = 1,iniciou = False,terminou= False,acertos = 0):
        self.usuario_id = usuario_id
        self.exercicio_id = exercicio_id
        self.iniciou = iniciou
        self.terminou = terminou
        self.questao_atual = questao_atual
        self.acertos = acertos


#Fecho a Sessão
session.close()