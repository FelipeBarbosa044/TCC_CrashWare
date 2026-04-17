from fastapi import APIRouter, Depends,HTTPException
from main import SECRET_KEY,  ALGORITIMO
#Importando tabelas:
from models.usuarios import Usuarios
from models.usuarios_oauth import UsuariosOauth, session
from models.patentes import Patente


#Instânciando roteador
auth = APIRouter(prefix="/auth",tags=["autenticação"])

#Importando session
from dependences import pegar_sessao

#Importando a CRIPTOGRAFIA
from security import criptografia

#Importando SHCEMAS:
from schemas.UsuarioSchema import UsuarioSchema, VerificarEmailSchema , ReenviarEmailSchema , UsuarioLoginSchema



#Biblioteca que gera números aletórios:
from random import randint

#Biblioteca de tempo
from datetime import datetime ,timedelta , timezone


#Funcionalidas para enviar codigo para o email
import smtplib
import email.message

#Importando criptografia para tokens
from jose import jwt,JWTError

#dotenv
import os
from dotenv import load_dotenv

load_dotenv()

PASSWORD_EMAIL = os.getenv("PASSWORD_EMAIL")

#Funções
def gerar_codigo():
    codigo = str(randint(100000,999999))
    expira_em = datetime.now(timezone.utc) + timedelta(minutes=10)

    return codigo , expira_em
######


def enviar_email(codigo, destinario):
    #Aqui vou colocar a mensagem que eu quero enviar.(A MENSAGEM TEM QUE ESTAR EM HTML)
    corpo_email =  f"""
    <p>Olá,</p>
    <p>Nós da CrashWare recebemos uma solicitação para verificar o seu e-mail em nossa plataforma.</p>
    <p>Para continuar, utilize o código de verificação abaixo:</p>
    <h1>Código: {codigo} </h1>
    <p>Este código é válido por 10 minutos.</p>
    <p>Se você não fez essa solicitação, ignore este e-mail.</p>
    <p>Atenciosamente,</p>
    <p>Equipe CrashWare</p>
    """


    msg = email.message.Message()
    msg['Subject'] = "Verificação de e-mail - CrashWare"  # Assunto/Titulo do email
    msg['From'] = 'plataformacrashware@gmail.com'  #que vai enviar a mensagem
    msg['To'] = f'{destinario}'  # Email que vai receber a mensagem
    password = f'{PASSWORD_EMAIL}'  # Senha do remetente.
    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(corpo_email)

    s = smtplib.SMTP('smtp.gmail.com: 587')
    s.starttls()
    # Login Credentials for sending the mail
    s.login(msg['From'], password)
    s.sendmail(msg['From'], [msg['To']], msg.as_string().encode('utf-8'))
    print('Email enviado')

#################

def gerar_token(id_usuario, validade = timedelta(minutes = 30)):
    data_expiracao = datetime.now(timezone.utc) + validade
    informacoes = {"sub" : str(id_usuario) , "expiration" : validade}
    token = jwt.encode(informacoes, SECRET_KEY, ALGORITIMO)
    return  token



#ROTAS:
@auth.post("/cadastro")
async def cadastro(dados : UsuarioSchema,session = Depends(pegar_sessao)):
    email_usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if email_usuario is not None:
        raise HTTPException(status_code=400,detail="Esse email já foi cadastrado")
    else:
        codigo , expira = gerar_codigo()
        try:
            #Salvo no Banco
            senha_criptografada = criptografia.hash(dados.senha)
            usuario_novo = Usuarios(nome_usuario=dados.nome_usuario.title(), email=dados.email,senha_hash=senha_criptografada, codigo=codigo, codigo_expirado_em=expira)
            session.add(usuario_novo)
            session.commit()

            # Enviando codigo para o email
            enviar_email(codigo, dados.email)


            #Resposta da API
            return{
                "mensagem" : "Usuário cadastrado com sucesso!"
            }
        except Exception as exception:
            session.rollback()
            raise  exception


@auth.post("/verificar_email")
async def verificar_email(dados : VerificarEmailSchema , session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is  None:
        raise HTTPException(status_code=404,detail="Email não encontrado!! Faça o cadastro antes!")
    if usuario.codigo != dados.codigo:
        raise HTTPException(status_code=400, detail="Código invalido!")
    if usuario.codigo_expirado_em < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="Código expirado!")

    usuario.email_verificado = True
    session.commit()
    return {"mensagem": "Email verificado com sucesso!"}

@auth.post("/reenviar_codigo")
async def reenviar_codigo( dados : ReenviarEmailSchema, session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is None:
        raise HTTPException(status_code=404,detail="Email não encontrado!! Faça o cadastro antes!")
    #Gero novo código
    codigo , expira = gerar_codigo()

    #Atualizo o banco
    usuario.codigo = codigo
    usuario.codigo_expirado_em = expira
    session.commit()

    #Envio email
    enviar_email(codigo, dados.email)

    return {"mensagem": "Código Reenviado!"}

@auth.post("/login")
async def login(dados : UsuarioLoginSchema , session = Depends(session)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is None:
        raise HTTPException(status_code=404,detail="Email não cadastrado")
    elif criptografia.verify(dados.senha , usuario.senha) == False:
        raise HTTPException(status_code=401,detail="Senha incorreta")
    else:
        acess_token = gerar_token(usuario.id_usuario)
        refresh_token = gerar_token(usuario.id_usuario, validade=timedelta(days=7))
        return {
            "token" : acess_token,
            "refresh_token" : refresh_token,
            "token_type": "bearer"
        }




        
    