from uuid import UUID

from pydantic import BaseModel, Field

class LeaderboardBase(BaseModel):
    """
    Shared leaderboard properties, visible to anyone
    """
    leaderboard_name: str | None = None
    picture: str | None = None
    is_active: bool | None = None

class PrivateLeaderboardBase(LeaderboardBase):
    invite_code: str

class LeaderboardUpdate(LeaderboardBase):
    leaderboard_name: str | None = None
    picture: str | None = None
    is_active: bool | None = None
    invite_code: str | None = None

class Leaderboard(PrivateLeaderboardBase):
    uuid: UUID

