from sqlalchemy import String, Integer, TypeDecorator, CHAR
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import uuid4
from app.db import Base


class Reviews(Base):
    __tablename__ = "reviews"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid4)
    product_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, default=0)
    text: Mapped[str] = mapped_column(String, nullable=False)
