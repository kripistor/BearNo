from sqlalchemy import String, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import uuid4
from app.db import Base

class Products(Base):
    __tablename__ = "products"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid4)
    image_url: Mapped[str] = mapped_column(String, nullable=False)
    name: Mapped[str] = mapped_column(String, unique=False, index=True)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    hops: Mapped[str] = mapped_column(String)  # сорт хмеля
    alcohol: Mapped[float] = mapped_column(Float, default=0.0)  # алкоголь
    ibu: Mapped[float] = mapped_column(Float, default=0.0)  # горечь
    density: Mapped[float] = mapped_column(Float, default=0.0)  # плотность
    vote_count: Mapped[int] = mapped_column(Integer, default=0)
    county: Mapped[str] = mapped_column(String)  # страна
    is_approved: Mapped[bool] = mapped_column(Integer, default=0)
    user_id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), nullable=False)