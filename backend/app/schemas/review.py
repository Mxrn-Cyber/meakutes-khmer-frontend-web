import datetime

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    destination_id: int
    rating: int = Field(ge=1, le=5)
    comment: str | None = None


class ReviewOut(BaseModel):
    id: int
    destination_id: int
    user_id: int
    user_display_name: str | None = None
    rating: int
    comment: str | None
    status: str
    created_at: datetime.datetime

    model_config = {"from_attributes": True}


class FavoriteOut(BaseModel):
    destination_id: int
    created_at: datetime.datetime

    model_config = {"from_attributes": True}
