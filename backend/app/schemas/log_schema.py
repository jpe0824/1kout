from uuid import UUID
from pydantic import BaseModel, Field
from datetime import date, datetime

class LogBase(BaseModel):
    """
    Shared Log properties, public
    """
    start_time: datetime
    end_time: datetime

class LogUpdate(LogBase):
    """
    Same properties as logbase
    """
    pass

class Log(LogBase):
    """
    Log properties returned by API
    """
    uuid: UUID