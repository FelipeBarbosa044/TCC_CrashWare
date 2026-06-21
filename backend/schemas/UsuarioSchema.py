from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema
from datetime import datetime

#SCHEMA Cadastro:
class CadastroSchema(BaseModel):
    nome_usuario : str
    email: str
    senha : str

    class Config:
        from_attributes = True

#SCHEMA Cadastro com Google:
class CadastroGoogleSchema(BaseModel):
    nome_usuario : str
    email: str
    foto: str
    sub: str



    class Config:
        from_attributes = True

#SCHEMA Cadastro com GitHub:
class CadastroGitHubSchema(BaseModel):
    nome_usuario : str
    email: str
    foto: str
    sub: str



    class Config:
        from_attributes = True

#SCHEMA Vericar Codigo
class VerificarEmailSchema(BaseModel):
    email : str
    codigo : str

    class Config:
        from_attributes = True

#SCHEMA Emails
class EmailSchema (BaseModel):
    email: Optional[str] = None
    email_novo : Optional[str] = None


    class Config:
        from_attributes = True

#SCHEMA Login
class UsuarioLoginSchema (BaseModel):
    email : str
    senha : str


    class Config:
        from_attributes = True

#Schema nome
class NomeSchema(BaseModel):
     nome : str

     class Config:
         from_attributes = True

#Schema senha
class SenhaSchema(BaseModel):
     senha : str

     class Config:
         from_attributes = True

#Telefone schema
class TelefoneSchema(BaseModel):
     telefone : str
     email : Optional[str] = None
     codigo: Optional[str] = None

     class Config:
         from_attributes = True




