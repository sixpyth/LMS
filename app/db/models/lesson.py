from app.db.models.base import BaseModel
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime, Enum
from enums.lesson import Format, LessonType
from sqlalchemy import UUID, ForeignKey
from uuid import uuid4


class Lesson(BaseModel):
    """List of lessons"""
    __tablename__ = "lessons"

    start_time: Mapped[DateTime] = mapped_column(DateTime)

    finish_time: Mapped[DateTime] = mapped_column(DateTime)

    teacher: Mapped[UUID] = mapped_column(unique=False, nullable=True)

    type: Mapped[Enum] = mapped_column(Enum(LessonType), nullable=False)

    format: Mapped[Enum] = mapped_column(
        Enum(Format),
        nullable=True,
    )

    teacher: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("profiles.user_id"), unique=False, default=uuid4
    )
    # teacher = relationship("Profile",back_populates="user_id")
