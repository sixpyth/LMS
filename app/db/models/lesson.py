from app.db.models.base import BaseModel
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from sqlalchemy import DateTime, Enum, UUID, ForeignKey
from enums.lesson import Format, LessonType
import uuid

class Lesson(BaseModel):
    __tablename__ = "lessons"

    start_time: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True)
    )


    finish_time: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True)

    )

    type: Mapped[Enum] = mapped_column(
        Enum(LessonType),
        nullable=False
    )

    format: Mapped[Enum] = mapped_column(
        Enum(Format),
        nullable=True,
        
    )

    # teacher = relationship("Profile",back_populates="user_id")
