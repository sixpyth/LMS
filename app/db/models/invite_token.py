from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UUID, DateTime, ForeignKey, String
from datetime import datetime
from app.db.models.base import BaseModel
import uuid
from utils.auth_generator import expires_at


class Token(BaseModel):
    __tablename__ = "tokens"

    user_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        default=uuid.uuid4,
    )

    token: Mapped[str] = mapped_column(
        String(45), unique=True, nullable=False, index=True
    )

    expires_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), default=expires_at
    )

    used_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), default=datetime.now().replace(microsecond=0)
    )
