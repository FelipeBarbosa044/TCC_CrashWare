from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema
from datetime import datetime

#SCHEMA USUARIO:
class UsuarioSchema(BaseModel):
    nome_usuario : str
    email: str
    senha : str

    class Config:
        from_attributes = True

#SCHEMA Vericar Email
class VerificarEmailSchema(BaseModel):
    email : str
    codigo : str

    class Config:
        from_attributes = True

#SCHEMA Reenviar Email
class ReenviarEmailSchema (BaseModel):
    email: str

    class Config:
        from_attributes = True

#SCHEMA Login
class UsuarioLoginSchema (BaseModel):
    email : str
    senha : str

    class Config:
        from_attributes = True
