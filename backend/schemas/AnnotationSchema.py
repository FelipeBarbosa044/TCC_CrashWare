from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema

#Schema de annotation

class AnnotationSchema(BaseModel):
    titulo : Optional[str] = None
    texto : Optional[str] = None
    id : Optional[int] = None
    titulo_antigo : Optional[str] = None
    texto_antigo: Optional[str] = None


    class Config:
        from_attributes = True
