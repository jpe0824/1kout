from typing import Any
from uuid import UUID

from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic.networks import EmailStr
from pydantic import ValidationError
from pymongo import errors

from app.models import user_model
from app.schemas import user_schema
from app.core.security import get_password_hash
from app.api.deps.user_deps import get_current_active_user, get_current_active_superuser

user_router = APIRouter()

@user_router.post("",operation_id="register_user", response_model=user_schema.User)
async def register_user(
    password: str = Body(...),
    email: str = Body(...),
    nick_name: str = Body(...),
    first_name: str = Body(None),
    last_name: str = Body(None)
):
    """
    Register a new user.
    """
    hashed_password = get_password_hash(password)
    try:
        user = user_model.User(
            email=email,
            hashed_password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            nick_name=nick_name
        )
    except ValidationError as exc:
        raise HTTPException(
            status_code=400, detail=f"{repr(exc.errors()[0]['msg'])}"
        )

    try:
        await user.create()
        return user

    except errors.DuplicateKeyError:
        raise HTTPException(
            status_code=400, detail="User with that email already exists."
        )


@user_router.get("", operation_id="get_users", response_model=list[user_schema.User])
async def get_users(
    limit: int | None = 10,
    offset: int | None = 0,
    admin_user: user_model.User = Depends(get_current_active_superuser),
):
    """
    Get all users

    ** Restricted to superuser **
    """
    users = await user_model.User.find_all().skip(offset).limit(limit).to_list()
    return users

@user_router.get("/me", operation_id="get_me", response_model=user_schema.User)
async def get_profile(
    current_user: user_model.User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@user_router.patch("/me", operation_id="update_me", response_model=user_schema.User)
async def update_profile(
    update: user_schema.UserUpdate,
    current_user: user_model.User = Depends(get_current_active_user),
) -> Any:
    """
    Update current user
    """
    update_data = update.model_dump(
        exclude={"is_active", "is_superuser"}, exclude_unset=True
    )
    try:
        if update_data["password"]:
            update_data["hashed_password"] = get_password_hash(update_data["password"])
            del update_data["password"]
    except KeyError:
        pass
    current_user = current_user.model_copy(update=update_data)

    try:
        await current_user.save()
        return current_user
    except (errors.DuplicateKeyError, RevisionIdWasChanged):
        raise HTTPException(
            status_code=400, detail="User with that email already exists."
        )
    except ValidationError:
        print("got validation error")
        raise HTTPException(
            status_code=400, detail=f"Validation error: {ValidationError.errors}"
        )

@user_router.delete("/me", operation_id="delete_me", response_model=user_schema.User)
async def delete_me(user: user_model.User = Depends(get_current_active_user)):
    """
    Delete current user.
    """
    await user.delete()
    return user

@user_router.patch("/{userid}", operation_id="update_user_by_id", response_model=user_schema.User)
async def update_user(
    userid: UUID,
    update: user_schema.UserUpdate,
    admin_user: user_model.User = Depends(get_current_active_superuser)
) -> Any:
    """
    Update a user.

    ** Restricted to superuser **

    Parameters
    ----------
    userid : UUID
        the user's UUID
    update : schemas.UserUpdate
        the update data
    current_user : models.User, optional
        the current superuser, by default Depends(get_current_active_superuser)
    """
    user = await user_model.User.find_one({"uuid": userid})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    update_data = update.model_dump(exclude_unset=True)
    try:
        if update_data["password"]:
            update_data["hashed_password"] = get_password_hash(update_data["password"])
            del update_data["password"]
    except KeyError:
        pass
    updated_user = user.model_copy(update=update_data)
    try:
        await updated_user.save()
        return updated_user
    except (errors.DuplicateKeyError, RevisionIdWasChanged):
        raise HTTPException(
            status_code=400, detail="User with that email already exists."
        )

@user_router.get("/{userid}",operation_id="get_user_by_id", response_model=user_schema.User)
async def get_user(
    userid: UUID, admin_user: user_model.User = Depends(get_current_active_superuser)
):
    """
    Get User Info

    ** Restricted to superuser **

    Parameters
    ----------
    userid : UUID
        the user's UUID

    Returns
    -------
    schemas.User
        User info
    """
    user = await user_model.User.find_one({"uuid": userid})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@user_router.delete("/{userid}", operation_id="delete_user_by_id", response_model=user_schema.User)
async def delete_user(
    userid: UUID, admin_user: user_model.User = Depends(get_current_active_superuser)
):
    """
    Delete a user.

    ** Restricted to superuser **
    """
    user = await user_model.User.find_one({"uuid": userid})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    await user.delete()
    return user