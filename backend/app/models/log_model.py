from typing import Annotated
from uuid import UUID, uuid4
from beanie import Document, Indexed, Link
from pydantic import Field
from datetime import datetime, timedelta, date
import pytz
from app.models.user_model import User

class Log(Document):
    uuid: Annotated[UUID, Field(default_factory=uuid4), Indexed(unique=True)]
    start_time: datetime = Field(default_factory=lambda: datetime.now(pytz.UTC))
    end_time: datetime = Field(default_factory=lambda: datetime.now(pytz.UTC))
    owner: User = Link[User]

    @property
    def total_hours(self) -> timedelta:
        return self.end_time - self.start_time

    @staticmethod
    async def get_logs_for_date_range(date_from: date, date_to: date) -> list['Log']:
        return await Log.find(
            Log.start_time >= date_from,
            Log.end_time <= date_to
        ).to_list()