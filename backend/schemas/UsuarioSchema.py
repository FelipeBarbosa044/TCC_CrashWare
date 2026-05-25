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

#SCHEMA Vericar Codigo
class VerificarEmailSchema(BaseModel):
    email : str
    codigo : str

    class Config:
        from_attributes = True

#SCHEMA Reenviar Email
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


