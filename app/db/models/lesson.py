from app.db.models.base import BaseModel
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enums.lesson import Format, LessonType
from sqlalchemy import UUID, ForeignKey, String, DateTime, Enum
from app.db.models.profile import Profile
from uuid import uuid4


class Lesson(BaseModel):
    """List of lessons"""

    __tablename__ = "lessons"

    start_time: Mapped[DateTime] = mapped_column(DateTime(timezone=True))

    finish_time: Mapped[DateTime] = mapped_column(DateTime(timezone=True))

    type: Mapped[Enum] = mapped_column(Enum(LessonType), nullable=False)

    format: Mapped[Enum] = mapped_column(
        Enum(Format),
        nullable=True,
    )

    teacher_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("profiles.user_id", ondelete="SET NULL"),
        unique=False
    )
    teacher: Mapped["Profile"] = relationship("Profile")

    color: Mapped[str] = mapped_column(String(7), default="#3174ad", nullable=False)
