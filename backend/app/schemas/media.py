import datetime

from pydantic import BaseModel


class MediaOut(BaseModel):
    id: int
    url: str
    alt_text: str | None
    created_at: datetime.datetime

    model_config = {"from_attributes": True}
