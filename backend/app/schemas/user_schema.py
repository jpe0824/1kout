from uuid import UUID

from beanie import PydanticObjectId
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    """
    Shared User properties. Visible by anyone.
    """

    first_name: str | None = None
    last_name: str | None = None
    nick_name: str | None = None
    picture: str | None = None

class PrivateUserBase(UserBase):
    """
    Shared User properties. Visible only by admins and self.
    """

    email: EmailStr | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None

class UserUpdate(UserBase):
    """
    User properties to receive via API on update.
    """

    password: str | None = None
    email: EmailStr | None = None
    first_name: str | None = None
    last_name: str | None = None
    nick_name: str | None = None
    is_active: bool | None = None
    is_superuser: bool | None = None

class User(PrivateUserBase):
    """
    User properties returned by API. Contains private
    user information such as email, is_active.

    Should only be returned to admins or self.
    """

    uuid: UUID

class PublicUser(UserBase):
    """
    Shared user properties and hours
    """
    hours: str