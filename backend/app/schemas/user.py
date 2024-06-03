import uuid
from typing import Optional, List

from pydantic import BaseModel, ConfigDict

from app.models.user import User


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None


class UserRead(UserCreate):
    id: uuid.UUID
    photo_url: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str
