from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String
from app.db.models.base import BaseModel


class Course(BaseModel):

    __tablename__ = "courses"
    title: Mapped[str] = mapped_column(String(32), nullable=True, unique=False)

    description: Mapped[str] = mapped_column(String(120), nullable=True, unique=False)
