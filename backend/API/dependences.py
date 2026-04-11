from database.session import SessionLocal


#Função de pegar a sessão com segurança.
def pegar_sessao():
    try:
        session = SessionLocal()
        yield session
    finally:
        session.close()