from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Enum, ForeignKey, UUID, Integer
from app.db.models.base import BaseModel
from enums.week_days import WeekDays
from app.db.models.lesson import Lesson

class Days(BaseModel):
    __tablename__ = "days"

    days: Mapped[Enum] = mapped_column(
        Integer, nullable=False, unique=False
    )

    lesson_id: Mapped[Lesson] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lessons.id"),
        nullable=True
    )

    lesson: Mapped["Lesson"] = relationship(
        "Lesson",
        back_populates="days"
    )
