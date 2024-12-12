from typing import Annotated
from uuid import UUID, uuid4
from beanie import Document, Indexed, Link
from pydantic import Field
from datetime import datetime
import pytz
from app.models.user_model import User

class Log(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    start_time: datetime = Field(default_factory=lambda: datetime.now(pytz.UTC))
    end_time: datetime = Field(default_factory=lambda: datetime.now(pytz.UTC))
    owner: User = Link[User]