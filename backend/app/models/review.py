import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    destination_id: Mapped[int] = mapped_column(ForeignKey("destinations.id"), index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    rating: Mapped[int] = mapped_column(Integer)  # 1-5, validated at the schema layer
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="published")  # published|flagged|removed
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship(lazy="joined")


class Favorite(Base):
    __tablename__ = "favorites"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    destination_id: Mapped[int] = mapped_column(ForeignKey("destinations.id"), primary_key=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    news_event_id: Mapped[int | None] = mapped_column(ForeignKey("news_events.id"), nullable=True)
    destination_id: Mapped[int | None] = mapped_column(ForeignKey("destinations.id"), nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    body: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())


class UserActivity(Base):
    __tablename__ = "user_activity"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(80))
    entity_type: Mapped[str | None] = mapped_column(String(80), nullable=True)
    entity_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())
