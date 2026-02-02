from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from sqlalchemy import DateTime, UUID
from uuid import uuid4
from datetime import datetime


class Base(DeclarativeBase):
    pass


class BaseModel(Base):
    __abstract__ = True
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid4
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow
    )
