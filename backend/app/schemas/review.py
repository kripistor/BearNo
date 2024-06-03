import uuid
from uuid import UUID
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class ReviewCreate(BaseModel):
    rating: int
    text: str


class ReviewUpdate(ReviewCreate):
    pass


class ReviewRead(ReviewCreate):
    id: UUID
    product_id: UUID
    user_id: UUID
    rating: int
    text: str
