from typing import Annotated, List, Optional
from uuid import UUID, uuid4
from beanie import Document, Indexed, Link
from pydantic import Field
from app.models.user_model import User

class Leaderboard(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    leaderboard_name: str = Annotated[str, Indexed(unique=True)]
    picture: str | None = None
    is_active: bool = True
    invite_code: Annotated[str, Indexed(unique=True)]
    owner: User = Link[User]
    users: Optional[List[User]] = []