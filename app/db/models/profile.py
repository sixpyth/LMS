from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Enum, UUID, ForeignKey
from app.db.models.base import BaseModel
from enums.profile_type import ProfileType
import uuid


class Profile(BaseModel):

    __tablename__ = "profiles"

    name: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
    )

    surname: Mapped[str] = mapped_column(
        String(32),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(String(12), nullable=False, unique=True)

    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        default=uuid.uuid4,
    )

    user = relationship("User", back_populates="profile", uselist=False)

    profile_type: Mapped[ProfileType] = mapped_column(
        Enum(ProfileType), nullable=False, unique=False, default="STUDENT"
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String(500), unique=True, nullable=True
    )
