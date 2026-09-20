import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.user import OAuthAccount, Role, User
from app.schemas.auth import (
    GoogleLoginRequest,
    LoginRequest,
    RegisterRequest,
    UpdateProfileRequest,
    UserOut,
)
from app.security import (
    create_session,
    get_current_user,
    hash_password,
    revoke_session,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()


def _set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.session_cookie_name,
        value=token,
        httponly=True,
        samesite="lax",
        max_age=settings.session_expire_minutes * 60,
        path="/",
    )


def _default_role(db: Session) -> Role | None:
    return db.query(Role).filter(Role.name == "user").first()


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
        display_name=f"{payload.first_name} {payload.last_name}".strip(),
    )
    role = _default_role(db)
    if role:
        user.roles.append(role)
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_session(db, user)
    _set_session_cookie(response, token)
    return UserOut.from_user(user)


@router.post("/login", response_model=UserOut)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This account has been deactivated")

    token = create_session(db, user)
    _set_session_cookie(response, token)
    return UserOut.from_user(user)


@router.post("/google", response_model=UserOut)
def google_login(payload: GoogleLoginRequest, response: Response, db: Session = Depends(get_db)):
    if not settings.google_client_id:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Google login is not configured")

    try:
        claims = google_id_token.verify_oauth2_token(
            payload.id_token, google_requests.Request(), settings.google_client_id
        )
    except ValueError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid Google token") from exc

    google_sub = claims["sub"]
    email = claims.get("email")

    oauth_account = (
        db.query(OAuthAccount)
        .filter(OAuthAccount.provider == "google", OAuthAccount.provider_user_id == google_sub)
        .first()
    )

    if oauth_account:
        user = db.get(User, oauth_account.user_id)
    else:
        user = db.query(User).filter(User.email == email).first() if email else None
        if not user:
            user = User(
                email=email,
                display_name=claims.get("name"),
                first_name=claims.get("given_name"),
                last_name=claims.get("family_name"),
            )
            role = _default_role(db)
            if role:
                user.roles.append(role)
            db.add(user)
            db.flush()
        db.add(OAuthAccount(user_id=user.id, provider="google", provider_user_id=google_sub, email=email))
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This account has been deactivated")

    token = create_session(db, user)
    _set_session_cookie(response, token)
    return UserOut.from_user(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(request: Request, response: Response, db: Session = Depends(get_db)):
    raw_token = request.cookies.get(settings.session_cookie_name)
    if raw_token:
        revoke_session(db, raw_token)
    response.delete_cookie(settings.session_cookie_name, path="/")


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return UserOut.from_user(user)


@router.patch("/me", response_model=UserOut)
def update_me(
    payload: UpdateProfileRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field in ("first_name", "last_name", "phone"):
        value = getattr(payload, field)
        if value is not None:
            setattr(user, field, value)
    if payload.first_name or payload.last_name:
        user.display_name = f"{user.first_name or ''} {user.last_name or ''}".strip()
    db.commit()
    db.refresh(user)
    return UserOut.from_user(user)
