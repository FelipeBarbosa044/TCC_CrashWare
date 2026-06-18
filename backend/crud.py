##Importando tabelas

from models import Usuarios, UsuariosOauth, Patente, Aula, Item_Loja, Usuario_Aula

#Importando A conexao com o Banco de dados
from database.connection import engine

#Importando a Base declarativa
from database.base import Base

#Importando a session
from database.session import Session

#Importando comandos do sql para o código.
from sqlalchemy import Column, String, Integer, update, true

from models.gamificacao import Conquista

# Cria a sessão
session = Session()

#Estrutura para comandos DML (Data Manipulation Language)
#try:
    #bloco
#except Exception as exception:
    #session.rollback()
    #raise  exception


try:
    # session.query(Usuarios).filter(Usuarios.email == "resferagamer@gmail.com").update({"moedas" : 3500})
    session.query(Conquista).filter(Conquista.id_conquista == 17).update({"moeda_bonus" : 15})
    # session.query(Patente).filter(Patente.id_patente == 3).update({"xp_minimo" : 4500})
    # item = Item_Loja(preco=50,compravel_uma_vez=True)
    # session.add(item)
    session.commit()
except Exception as exception:
    session.rollback()
    raise  exception


#Fecho a sessão
session.close()