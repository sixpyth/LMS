from app.db.models.base import BaseModel
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from sqlalchemy import DateTime, Enum, UUID, ForeignKey
from enums.lesson import Format, LessonType
import uuid

class LessonStudents(BaseModel):
    __tablename__ = "lessons_students"

    #lesson's id
    lesson_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lessons.id"),
        nullable=False,
        unique=True,
        default=uuid.uuid4
    )

    # Student's id
    profile_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        default=uuid.uuid4,
    )
