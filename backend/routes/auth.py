from fastapi import APIRouter, Depends,HTTPException
from requests import delete
from sqlalchemy import null

from authlib.integrations.starlette_client import OAuth
from fastapi import Request
from starlette.responses import RedirectResponse

oauth = OAuth()



import requests

#Importando tabelas:
from models.usuarios import Usuarios
from models.usuarios_oauth import UsuariosOauth

#Instânciando roteador
auth = APIRouter(prefix="/auth",tags=["autenticação"])

#Importando dependencias
from dependences import pegar_sessao,  validar_refresh_token , validar_token

#Importando a CRIPTOGRAFIA
from security import criptografia

#Importando SHCEMAS:
from schemas.UsuarioSchema import CadastroSchema, CadastroGoogleSchema,CadastroGitHubSchema, VerificarEmailSchema , EmailSchema , UsuarioLoginSchema, NomeSchema,SenhaSchema,TelefoneSchema


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


#Biblioteca de SMS
from twilio.rest import Client




load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
PASSWORD_EMAIL = os.getenv("PASSWORD_EMAIL")
ALGORITIMO = os.getenv("ALGORITIMO")


#TWILIO SMS

#Id da minha conta da twillio
ACOUNT_SID = os.getenv("ACOUNT_SID")

#Conexão com a API da twillio
AUTH_TOKEN = os.getenv("AUTH_TOKEN")

TWILIO_PHONE_NUMBER= os.getenv("TWILIO_PHONE_NUMBER")

#Conexão com a API da twillio
cliente = Client(ACOUNT_SID,AUTH_TOKEN)

#Bucket do supabase

#Pego informações do banco e do bucket:
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")
SUPABASE_BUCKET2 = os.getenv("SUPABASE_BUCKET2")

##Pego informações da auth do github
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

#GitHub
oauth.register(
    name="github",
    client_id=GITHUB_CLIENT_ID,
    client_secret=GITHUB_CLIENT_SECRET,
    authorize_url="https://github.com/login/oauth/authorize",
    access_token_url="https://github.com/login/oauth/access_token",
    api_base_url="https://api.github.com/",
    client_kwargs={
        "scope": "user:email"
    }
)





#Funções
def gerar_codigo():
    codigo = str(randint(100000,999999))
    expira_em = datetime.now(timezone.utc) + timedelta(minutes=10)

    return codigo , expira_em
######

def EnviarSms(codigo,destinario):
    #Crio o SMS
    try:
        mensagem = cliente.messages.create(
            from_=TWILIO_PHONE_NUMBER,
            to=f"+55{destinario}",
            body=f"Equipe CRASHWARE: o codigo  expira em 10 minutos. CODIGO: {codigo}"
        )

        #Retorno  para a rota que chamou
        return mensagem.sid

    except Exception as erro:
        print("Erro ao enviar SMS:", erro)
        raise HTTPException(
            status_code=500,
            detail="Erro ao enviar SMS de verificacao"
        )




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
    msg['From'] = 'plataformacrashware@gmail.com'  #email que vai enviar a mensagem
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

def gerar_token(id_usuario,tipo, validade = timedelta(hours = 1)):
    data_expiracao = datetime.now(timezone.utc) + validade
    informacoes = {"sub" : str(id_usuario) , "exp" : data_expiracao.timestamp(),"tipo" : tipo}
    token = jwt.encode(informacoes, SECRET_KEY, ALGORITIMO)
    return  token



#ROTAS:
@auth.post("/cadastro")
async def cadastro(dados : CadastroSchema,session = Depends(pegar_sessao)):
    email_usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if email_usuario is not None:
        raise HTTPException(status_code=400,detail="Esse email já foi autenticado")
    else:
        codigo , expira = gerar_codigo()
        try:
            #Salvo no Banco
            senha_criptografada = criptografia.hash(dados.senha)
            usuario_novo = Usuarios(nome_usuario=dados.nome_usuario.title(), email=dados.email,senha_hash=senha_criptografada, codigo=codigo, codigo_expirado_em=expira)
            session.add(usuario_novo)
            session.commit()
            #Resposta da API
            return{
                "mensagem" : "Cadastro realizado com sucesso!"
            }
        except Exception as exception:
            session.rollback()
            raise  exception

#############
@auth.post("/cadastro_google")
async def cadastroGoogle(dados : CadastroGoogleSchema,session = Depends(pegar_sessao)):
    email_usuario = session.query(Usuarios).filter(Usuarios.email == dados.email.lower()).first()
    if email_usuario is not None:
        acess_token = gerar_token(email_usuario.id_usuario, tipo="access")
        refresh_token = gerar_token(email_usuario.id_usuario, validade=timedelta(days=7), tipo="refresh")
        raise HTTPException(status_code=400, detail={"mensagem": "Esse email já foi autenticado",
                                                                 "token": acess_token,
                                                                    "refresh_token": refresh_token,
                                                                    "token_type": "bearer"
                                                                    })

    try:
        usuario = Usuarios(nome_usuario=dados.nome_usuario.title(), email=dados.email.lower(),email_verificado=True)
        session.add(usuario)
        session.commit()
        session.refresh(usuario)

        foto = requests.get(dados.foto)

        if foto.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Não foi possível baixar a foto do Google"
            )

        usuario_oauth = UsuariosOauth(provider="Google",provider_user_id=dados.sub,usuario_id=usuario.id_usuario)
        session.add(usuario_oauth)
        session.commit()


        conteudo_imagem = foto.content

        id = str(usuario.id_usuario) + '/'
        nome_arquivo = id + "foto"

        ##Gero uma nova imagem no bucket

        ##Gero uma requisição


        ##URL DE UPLOAD
        url_upload = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{nome_arquivo}"

        # Headers da requisição
        headers = {
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "apikey": SUPABASE_KEY,
            "Content-Type": foto.headers.get(
                "Content-Type",
                "image/jpeg"
            )
        }

        # Requisição
        resposta = requests.post(
            url_upload,
            headers=headers,
            data=conteudo_imagem
        )

        if (resposta.status_code > 199 and resposta.status_code < 300):
            ##Retorno mensagem de sucesso

            acess_token = gerar_token(usuario.id_usuario, tipo="access")
            refresh_token = gerar_token(usuario.id_usuario, validade=timedelta(days=7), tipo="refresh")

            usuario.foto = nome_arquivo
            session.commit()
            return {"mensagem": "Cadastro com Google Realizado com Sucesso!",
                    "token" : acess_token,
                    "refresh_token": refresh_token,
                    "token_type": "bearer"
                    }

        else:
            ##Retorno o erro
            raise HTTPException(status_code=400, detail=resposta.text)


    except Exception as exception:
        session.rollback()
        raise exception


#############
@auth.get("/github")
async def github(request: Request):

    redirect_uri = "https://api-crashware.onrender.com/auth/cadastro_github"

    return await oauth.github.authorize_redirect(
        request,
        redirect_uri
    )



#############
@auth.get("/cadastro_github")
async def cadastroGitHub(request: Request,session = Depends(pegar_sessao)):
    tokengit = await oauth.github.authorize_access_token(request)

    resp = await oauth.github.get("user",token=tokengit)

    usuario = resp.json()

    emails = await oauth.github.get("user/emails",token=tokengit)

    ##Pego o email
    lista_emails = emails.json()
    email = None
    for item in lista_emails:
        if item["primary"] and item["verified"]:
            email = item["email"]
            break

    if not email:
        raise HTTPException( status_code=400,detail="Não foi possível obter o email do GitHub")

    ##Pego os outros dados
    dados = usuario

    github_id = dados["id"]
    username = dados["login"]
    foto = dados["avatar_url"]

    #Verifico se já tem no BD
    usuario = session.query(Usuarios).filter(Usuarios.email == email.lower()).first()

    oauth_usuario = session.query(UsuariosOauth).filter(UsuariosOauth.provider == "GitHub",UsuariosOauth.provider_user_id == str(github_id)).first()

    if oauth_usuario is not None:
        usuario = session.query(Usuarios).filter( Usuarios.id_usuario == oauth_usuario.usuario_id).first()

    if usuario is not None:
        ##Se ja tiver
        ##Gero os tokens
        acess_token = gerar_token(usuario.id_usuario, tipo="access")
        refresh_token = gerar_token(usuario.id_usuario, validade=timedelta(days=7), tipo="refresh")
        #Vai para o home
        return RedirectResponse(
            url=f"https://crashware.onrender.com/oauth/sucesso?access_token={acess_token}&refresh_token={refresh_token}"
        )
    else:
        try:
            ##Cadastro o usuario no banco de dados
            usuario = Usuarios(nome_usuario=username, email=email,foto=foto,
                               email_verificado=True)

            session.add(usuario)
            session.commit()
            session.refresh(usuario)

            #Instalo a Foto
            foto = requests.get(foto)

            if foto.status_code != 200:
                raise HTTPException( status_code=400,detail="Não foi possível baixar a foto do GitHub")


            #Cadastro from usuario na tabela  Usuario_Oauth
            usuario_oauth = UsuariosOauth(provider="GitHub", provider_user_id=str(github_id), usuario_id=usuario.id_usuario)

            session.add(usuario_oauth)
            session.commit()

            conteudo_imagem = foto.content

            id = str(usuario.id_usuario) + '/'
            nome_arquivo = id + "foto"

            ##Gero uma nova imagem no bucket

            ##Gero uma requisição

            ##URL DE UPLOAD
            url_upload = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{nome_arquivo}"

            # Headers da requisição
            headers = {
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "apikey": SUPABASE_KEY,
                "Content-Type": foto.headers.get(
                    "Content-Type",
                    "image/jpeg"
                )
            }

            # Requisição
            resposta = requests.post(
                url_upload,
                headers=headers,
                data=conteudo_imagem
            )

            if (resposta.status_code > 199 and resposta.status_code < 300):

                #Gero os tokens
                acess_token = gerar_token(usuario.id_usuario, tipo="access")
                refresh_token = gerar_token(usuario.id_usuario, validade=timedelta(days=7), tipo="refresh")

                #Coloco a fot no perfil do usuario
                usuario.foto = nome_arquivo
                session.commit()

                # Vai para o home
                return RedirectResponse(
                    url=f"https://crashware.onrender.com/oauth/sucesso?access_token={acess_token}&refresh_token={refresh_token}"
                )
            else:
                ##Retorno o erro
                raise HTTPException(status_code=400, detail=resposta.text)



        except Exception as exception:
            session.rollback()
            raise exception


#############

@auth.post("/verificar_codigo")
async def verificar_codigo(dados : VerificarEmailSchema , session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is  None:
        raise HTTPException(status_code=404,detail="Email não autenticado")
    if usuario.codigo != dados.codigo:
        raise HTTPException(status_code=400, detail="Código invalido!")
    if usuario.codigo_expirado_em < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="Código expirado!")

    usuario.email_verificado = True
    session.commit()
    return {"mensagem": "Código verificado com sucesso!"}

####################

@auth.post("/reenviar_codigo")
async def reenviar_codigo( dados : EmailSchema, session = Depends(pegar_sessao)):
    if dados.email_novo is None:
        email = dados.email
    else:
        email = dados.email_novo

    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    #Gero novo código
    codigo , expira = gerar_codigo()

    #Atualizo o banco
    usuario.codigo = codigo
    usuario.codigo_expirado_em = expira
    session.commit()

    #Envio email
    enviar_email(codigo, email)

    return {"mensagem": "Código Enviado!"}

########################
@auth.post('/enviar_sms')
async def enviar_sms(dados : TelefoneSchema,session = Depends(pegar_sessao)):
    #Pego o usuario pelo email ou pelo o telefone
    if (dados.email != None):
        usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    else:
        usuario = session.query(Usuarios).filter(Usuarios.telefone == dados.telefone).first()


    # Verifico se está valido o sms
    if (usuario.sms != None):
        # Pego a validade e a data Atual
        validade = usuario.sms_expirado_em
        agora = datetime.now(timezone.utc)

        if(validade > agora):
            raise HTTPException(status_code=409, detail="Código Já Enviado!")

    # Gero novo código
    codigo, expira = gerar_codigo()

    # Atualizo o banco
    usuario.sms = codigo
    usuario.sms_expirado_em = expira
    session.commit()

    # Envio  o SMS
    EnviarSms(codigo,dados.telefone)

    return {"mensagem": "SMS Enviado!"}
#########################
@auth.post("/verificar_sms")
async def verificar_sms(dados : TelefoneSchema , session = Depends(pegar_sessao)):
    # Pego o usuario pelo email ou pelo o telefone
    if (dados.email != None):
        usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    else:
        usuario = session.query(Usuarios).filter(Usuarios.telefone == dados.telefone).first()
    if usuario is  None:
        raise HTTPException(status_code=404,detail="Email e telefone não autenticado")

    if usuario.sms != dados.codigo:
        raise HTTPException(status_code=400, detail="Código invalido!")

    if usuario.sms_expirado_em < datetime.now(timezone.utc):
        raise HTTPException(status_code=410, detail="Código expirado!")


    return {"mensagem": "SMS verificado com sucesso!"}





#########################

@auth.post("/login")
async def login(dados : UsuarioLoginSchema , session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is None:
        raise HTTPException(status_code=404,detail="Email não autenticado")
    elif criptografia.verify(dados.senha , usuario.senha_hash) == False:
        raise HTTPException(status_code=401,detail="Senha incorreta")
    else:
        if usuario.email_verificado ==  False:
            raise HTTPException(status_code=403,detail={
                "erro" : "Email não verificado!!",
                "nome" : usuario.nome_usuario
            })
        else:
            acess_token = gerar_token(usuario.id_usuario,tipo="access")
            refresh_token = gerar_token(usuario.id_usuario, validade=timedelta(days=7),tipo="refresh")
            return {
                "token" : acess_token,
                "refresh_token" : refresh_token,
                "token_type": "bearer"
            }

########################
@auth.post("/verificar_email")
async def verificar_email(dados: EmailSchema , session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is None:
        raise  HTTPException(status_code=404,detail="Email não autenticado")
    else:
        return {"mensagem": "Email verificado com sucesso!"}

###################

@auth.post("/alterar_senha")
async def alterar_senha(dados: UsuarioLoginSchema, session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Email não autenticado")
    if criptografia.verify(dados.senha, usuario.senha_hash) == True:
        raise HTTPException(status_code=400,detail="Você não pode usar a mesma senha")
    else:
        senha_criptografada = criptografia.hash(dados.senha)
        usuario.senha_hash = senha_criptografada
        session.commit()
        return {"mensagem": "Senha alterada com sucesso!"}

##################

##Rota de verificação de token
@auth.post("/verificar_token")
async def verificar_token (usuario = Depends(validar_token)):
    return usuario

##Rota de verificação do refresh token
@auth.post("/verificar_refresh_token")
async def verificar_refresh_token (usuario = Depends(validar_refresh_token)):
    return usuario


############################

##Rota do Refresh_Token
@auth.post("/refresh_token")
async def refresh_token(usuario = Depends(validar_refresh_token), session = Depends(pegar_sessao)):
    usuario = session.query(Usuarios).filter(Usuarios.id_usuario == usuario.id_usuario).first()
    if usuario is None:
        raise HTTPException(status_code=401,detail="Token expirado ou inválido")
    token = gerar_token(usuario.id_usuario,tipo="access")
    return {
        "token" : token,
        "token_type" : "bearer"
    }

##################

##Rota de Adicionar Telefone
@auth.post('/adicionar_telefone')
async def adicionar_telefone(dados : TelefoneSchema,session = Depends(pegar_sessao)):
    # Pego o usuario pelo email ou pelo o telefone
    if (dados.email != None):
        usuario = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if usuario is None:
        raise HTTPException(status_code=404, detail="Email não autenticado")
    try:
        usuario.telefone = dados.telefone
        session.commit()

        return {"mensagem" : "Telefone Adicionado!"}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


############################
##Rota De Verificar Telefone
@auth.post('/verificar_telefone')
async def verificar_telefone(dados : TelefoneSchema,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")
    telefone = session.query(Usuarios).filter(Usuarios.telefone == dados.telefone).first()

    #Verifico se já existe o telefone

    if telefone is None:
        return {"mensagem" : "Telefone Aprovado"}
    else:
        raise HTTPException(status_code=409,detail="Telefone Já Autenticado , Tente Outro")



############################

#Rota de remover telefone
@auth.patch('/remover_telefone')
async def remover_telefone (usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")
    #Removo o telefone do usuario
    try:
        usuario.telefone = None
        session.commit()

        return {"mensagem" : "Telefone Removido"}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


#############################


##Rota de alterar Nome
@auth.patch('/alterar_nome')
async def alterar_nome(dados : NomeSchema ,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")
    try:
        usuario.nome_usuario = dados.nome.title()
        session.commit()

        # Mensagem da API
        return {
            "mensagem": "Nome alterado com sucesso!",
            "nome" : usuario.nome_usuario
         }

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))


############################


##Rota de alterar e-mail
@auth.post('/validar_email')
async def validar_email(dados : EmailSchema,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")
    email = session.query(Usuarios).filter(Usuarios.email == dados.email).first()
    if email is not None:
        #Se email não chegar nulo
        raise HTTPException(status_code=409,detail="Email Já Autenticado, Tente Outro")
    else:
        #Validaçao aprovada
        return {"mensagem" : "Email Aprovado"}


############################

#Rota de Alterar Email
@auth.patch('/alterar_email')
async def alterar_email(dados : EmailSchema,usuario = Depends(validar_token),session = Depends(pegar_sessao)):
    if usuario is None:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")
    #Altero o email
    try:
        usuario.email = dados.email_novo
        session.commit()

        #Mensagem da API
        return {"mensagem": "Email alterado com sucesso"}

    except Exception as exception:
        ##Se não der certo eu retorno o erro, e dou rollback no banco.
        session.rollback()
        raise HTTPException(status_code=400, detail=str(exception))

#Rota de Verificar Senha
@auth.post('/verificar_senha')
async def verificar_senha(dados : SenhaSchema,usuario = Depends(validar_token)):
    if usuario is None:
        raise HTTPException(status_code=401, detail="Token expirado ou inválido")
    if criptografia.verify(dados.senha , usuario.senha_hash) == False:
        raise HTTPException(status_code=401, detail="Senha incorreta")
    else:
        return {"mensagem" : "Senha Aprovada!"}










        
    