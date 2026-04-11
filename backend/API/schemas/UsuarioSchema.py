from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema

#SCHEMA USUARIO:
class UsuarioSchema(BaseModel):
    nome : str
    email: str
    senha : str

    class Config:
        from_attributes = True