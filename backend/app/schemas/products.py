import uuid
from uuid import UUID
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    rating: float = 0
    hops: str
    alcohol: float
    ibu: int
    density: float
    vote_count: int = 0
    county: str
    is_approved: bool = False
    image_url: str
    user_id: UUID


class ProductUpdate(ProductCreate):
    pass


class ProductRead(ProductCreate):
    id: UUID
