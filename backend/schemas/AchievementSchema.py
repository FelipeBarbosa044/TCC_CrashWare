from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema

#SCHEMA ConquistaSchema
class AchievementSchema(BaseModel):
    conquista_id : int

    class Config:
        from_attributes = True