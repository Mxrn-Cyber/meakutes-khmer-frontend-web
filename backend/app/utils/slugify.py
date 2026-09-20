from slugify import slugify
from sqlalchemy.orm import Session


def unique_slug(db: Session, model, name: str, exclude_id: int | None = None) -> str:
    """Slugify `name` and, if it collides with an existing row, append -2, -3, ... until free."""
    base = slugify(name) or "item"
    candidate = base
    n = 2
    while True:
        query = db.query(model).filter(model.slug == candidate)
        if exclude_id is not None:
            query = query.filter(model.id != exclude_id)
        if not db.query(query.exists()).scalar():
            return candidate
        candidate = f"{base}-{n}"
        n += 1
