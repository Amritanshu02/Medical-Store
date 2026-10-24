from typing import Optional

from pydantic import BaseModel, Field


class MedicineItem(BaseModel):
    id: Optional[str] = None
    name: str
    brand: Optional[str] = None
    composition: Optional[str] = None
    description: Optional[str] = None
    substitutes: Optional[str] = None
    available: bool = True
    price: Optional[float] = None


class SuggestionRequest(BaseModel):
    query: Optional[str] = Field(default=None, description="Customer search text")
    medicine: Optional[MedicineItem] = Field(
        default=None, description="Out-of-stock medicine from search or cart"
    )
    catalog: list[MedicineItem] = Field(default_factory=list)
    top_k: int = Field(default=5, ge=1, le=20)


class Alternative(BaseModel):
    id: Optional[str] = None
    name: str
    brand: Optional[str] = None
    composition: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    available: bool = True
    score: float
    reason: str


class SuggestionGroup(BaseModel):
    for_medicine: Optional[str] = None
    for_query: Optional[str] = None
    out_of_stock: bool = True
    alternatives: list[Alternative] = Field(default_factory=list)


class SuggestionResponse(BaseModel):
    groups: list[SuggestionGroup] = Field(default_factory=list)
    model: str
