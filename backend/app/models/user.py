from typing import Optional, List
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import uuid4
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid4)
    photo_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_admin: Mapped[bool] = mapped_column(Integer, default=0)
    username: Mapped[str] = mapped_column(String, unique=False, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password: Mapped[str] = mapped_column(String)
