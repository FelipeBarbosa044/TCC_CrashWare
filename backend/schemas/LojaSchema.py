from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema

#Schema Item
class ItemSchema(BaseModel):
    nome : str
    moedas : int

    class Config:
        from_attributes = True