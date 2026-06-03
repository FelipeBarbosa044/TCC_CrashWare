from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema

#Schema de annotation

class AnnotationSchema(BaseModel):
    titulo : str
    texto : Optional[str] = None

    class Config:
        from_attributes = True
