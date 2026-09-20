from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import Role, User
from app.schemas.user import AdminUserOut, SetActiveRequest, UpdateRolesRequest
from app.security import require_role

router = APIRouter(prefix="/api/admin/users", tags=["admin-users"])


@router.get("", response_model=list[AdminUserOut])
def list_users(db: Session = Depends(get_db), _: User = Depends(require_role("admin"))):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [AdminUserOut.from_user(u) for u in users]


@router.put("/{user_id}/roles", response_model=AdminUserOut)
def set_roles(
    user_id: int,
    payload: UpdateRolesRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    target.roles = db.query(Role).filter(Role.name.in_(payload.roles)).all()
    db.commit()
    db.refresh(target)
    return AdminUserOut.from_user(target)


@router.put("/{user_id}/active", response_model=AdminUserOut)
def set_active(
    user_id: int,
    payload: SetActiveRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_role("admin")),
):
    target = db.get(User, user_id)
    if not target:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    target.is_active = payload.is_active
    db.commit()
    db.refresh(target)
    return AdminUserOut.from_user(target)
