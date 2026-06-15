from pydantic import BaseModel #Responsável para criar Schema
from typing import Optional #Adiciona tipos primitivos para o Schema

#Schema da Aula
class AulaSchema(BaseModel):
    titulo : str
    tipo : Optional[str] = None
    modulo : Optional[int] = None
    subtitulo1 : str
    paragrafo1 : str
    subtitulo2: Optional[str] = None
    paragrafo2: Optional[str] = None
    subtitulo3: Optional[str] = None
    paragrafo3: Optional[str] = None
    subtitulo4: Optional[str] = None
    paragrafo4: Optional[str] = None
    moeda_bonus : int
    xp_bonus : float

    class Config:
        from_attributes = True

#Schema de Exercicio
class ExercicioSchema(BaseModel):
    aula_id : int

    class Config:
        from_attributes = True

#Schema de Questao
class QuestaoSchema(BaseModel):
    exercicio_id : int
    pergunta : str
    ordem : int

    class Config:
        from_attributes = True

#Schema de Alternativa
class AlternativaSchema(BaseModel):
    questao_id : int
    texto: str
    correta : bool

    class Config:
        from_attributes = True

class MateriaSchema(BaseModel):
    id_aula : int

    class Config:
        from_attributes = True



