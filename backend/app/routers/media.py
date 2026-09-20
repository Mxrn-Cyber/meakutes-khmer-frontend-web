import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.media import Media
from app.models.user import User
from app.schemas.media import MediaOut
from app.security import require_role

router = APIRouter(prefix="/api/media", tags=["media"])
settings = get_settings()

ALLOWED_TYPES = {"image/png", "image/jpeg", "image/webp", "image/gif"}
MAX_BYTES = 8 * 1024 * 1024


@router.get("", response_model=list[MediaOut])
def list_media(db: Session = Depends(get_db), _: User = Depends(require_role("admin", "editor"))):
    return db.query(Media).order_by(Media.created_at.desc()).all()


@router.post("", response_model=MediaOut, status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(require_role("admin", "editor")),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Unsupported image type")

    contents = await file.read()
    if len(contents) > MAX_BYTES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Image too large (max 8MB)")

    media_root = Path(settings.media_root)
    media_root.mkdir(parents=True, exist_ok=True)
    extension = Path(file.filename or "").suffix or ".bin"
    filename = f"{uuid.uuid4().hex}{extension}"
    (media_root / filename).write_bytes(contents)

    media = Media(url=f"{settings.media_url_prefix}/{filename}", uploaded_by=user.id)
    db.add(media)
    db.commit()
    db.refresh(media)
    return media


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media(
    media_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    media = db.get(Media, media_id)
    if not media:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Media not found")
    filename = media.url.rsplit("/", 1)[-1]
    file_path = Path(settings.media_root) / filename
    file_path.unlink(missing_ok=True)
    db.delete(media)
    db.commit()
