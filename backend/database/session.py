from .connection import  engine
#Importo a variável que contem a conexão com o supabase

from sqlalchemy.orm import sessionmaker
#Importo a session

#Esses comandos permite que o programa crie sessões para executar operações no banco de dados.
Session = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

