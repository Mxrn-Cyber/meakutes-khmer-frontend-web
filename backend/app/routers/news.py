from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.news import NewsEvent
from app.models.user import User
from app.schemas.news import NewsEventCreate, NewsEventOut, NewsEventUpdate
from app.security import require_role
from app.utils.slugify import unique_slug

router = APIRouter(prefix="/api/news", tags=["news"])


@router.get("", response_model=list[NewsEventOut])
def list_news(
    status_filter: str | None = Query(default="published", alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(NewsEvent)
    if status_filter and status_filter != "all":
        query = query.filter(NewsEvent.status == status_filter)
    return query.order_by(NewsEvent.event_date.is_(None), NewsEvent.event_date).all()


@router.get("/{slug}", response_model=NewsEventOut)
def get_news(slug: str, db: Session = Depends(get_db)):
    item = db.query(NewsEvent).filter(NewsEvent.slug == slug).first()
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "News item not found")
    return item


@router.post("", response_model=NewsEventOut, status_code=status.HTTP_201_CREATED)
def create_news(
    payload: NewsEventCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin", "editor")),
):
    item = NewsEvent(**payload.model_dump(), created_by=user.id)
    item.slug = unique_slug(db, NewsEvent, payload.title)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{news_id}", response_model=NewsEventOut)
def update_news(
    news_id: int,
    payload: NewsEventUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin", "editor")),
):
    item = db.get(NewsEvent, news_id)
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "News item not found")
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(item, field, value)
    if "title" in data:
        item.slug = unique_slug(db, NewsEvent, data["title"], exclude_id=item.id)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_news(
    news_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    item = db.get(NewsEvent, news_id)
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "News item not found")
    db.delete(item)
    db.commit()
