from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema


#Recursos Schema
class RecursoSchema(BaseModel):
    xp : float = 0
    moedas : int = 0

    class Config:
        from_attributes = True

