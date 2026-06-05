from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema

#SCHEMA ConquistaSchema
class ConquistaSchema(BaseModel):
    nome_conquista : str
    tipo_conquista : str
    descricao : str
    moeda : int
    xp : float
    condicao_conquista : str

    class Config:
        from_attributes = True

#SCHEMA Deltar Conquist Schema
class DeletarConquistaSchema(BaseModel):
     id_conquista : int

     class Config:
         from_attributes = True

#Schema de Banir Usuario
class BanirSchema(BaseModel):
    id_usuario : int

    class Config:
        from_attributes = True


    