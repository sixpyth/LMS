from app.db.models.base import BaseModel
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import UUID, ForeignKey
import uuid


class LessonStudents(BaseModel):
    __tablename__ = "lessons_students"

    # lesson's id
    lesson_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lessons.id"),
        nullable=False,
        unique=False,
        default=uuid.uuid4,
    )

    # Student's id
    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=False,
        default=uuid.uuid4,
    )

    lesson = relationship("Lesson", back_populates="students")

    user = relationship("User")