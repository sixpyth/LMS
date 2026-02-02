from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Enum
from app.db.models.base import BaseModel
from enums.user_status import UserStatus


class User(BaseModel):

    __tablename__ = "users"

    login: Mapped[str] = mapped_column(String(16), nullable=False, unique=True)

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    email: Mapped[str] = mapped_column(String(32), unique=True, nullable=True)

    profile = relationship("Profile", back_populates="user", uselist=False, lazy="selectin")

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    status: Mapped[UserStatus] = mapped_column(
        Enum(UserStatus), nullable=False, default=UserStatus.PENDING
    )
