from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.destination import Destination
from app.models.review import Favorite
from app.models.user import User
from app.schemas.destination import DestinationOut
from app.security import get_current_user

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


@router.get("", response_model=list[DestinationOut])
def list_my_favorites(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Import locally to avoid a circular import with the destinations router.
    from app.routers.destinations import _to_out

    favorite_ids = [
        row.destination_id for row in db.query(Favorite).filter(Favorite.user_id == user.id)
    ]
    if not favorite_ids:
        return []
    destinations = db.query(Destination).filter(Destination.id.in_(favorite_ids)).all()
    return [_to_out(db, d) for d in destinations]


@router.post("/{destination_id}", status_code=status.HTTP_201_CREATED)
def add_favorite(
    destination_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    if not db.get(Destination, destination_id):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Destination not found")
    existing = (
        db.query(Favorite)
        .filter(Favorite.user_id == user.id, Favorite.destination_id == destination_id)
        .first()
    )
    if not existing:
        db.add(Favorite(user_id=user.id, destination_id=destination_id))
        db.commit()
    return {"destination_id": destination_id, "favorited": True}


@router.delete("/{destination_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    destination_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    (
        db.query(Favorite)
        .filter(Favorite.user_id == user.id, Favorite.destination_id == destination_id)
        .delete()
    )
    db.commit()
