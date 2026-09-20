from pydantic import BaseModel


class AdminUserOut(BaseModel):
    id: int
    email: str
    display_name: str | None
    is_active: bool
    roles: list[str] = []

    model_config = {"from_attributes": True}

    @classmethod
    def from_user(cls, user) -> "AdminUserOut":
        return cls(
            id=user.id,
            email=user.email,
            display_name=user.display_name,
            is_active=user.is_active,
            roles=[r.name for r in user.roles],
        )


class UpdateRolesRequest(BaseModel):
    roles: list[str]


class SetActiveRequest(BaseModel):
    is_active: bool
