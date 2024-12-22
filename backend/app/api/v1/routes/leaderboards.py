from typing import Any
from uuid import UUID
from datetime import timedelta

from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import ValidationError
from pymongo import errors

from app.models import log_model
from app.models import user_model
from app.schemas import user_schema
from app.schemas import log_schema
from app.models import leaderboard_model
from app.schemas import leaderboard_schema
from app.api.deps.user_deps import get_current_active_user
from app.api.deps.leaderboard_deps import generate_unique_code

leaderboard_router = APIRouter()

@leaderboard_router.post("", operation_id="create_leaderboard", response_model=leaderboard_schema.Leaderboard)
async def create_leaderboard(
    leaderboard_name: str = Body(...),
    owner: user_model.User = Depends(get_current_active_user)
):
    """
    Creates a new leaderboard

    ** Restricted to current and logged in user**

    Parameters
    ----------
    leaderboard_name: str, unique

    Returns
    -------
    schemas.Leaderboard
    """
    try:
        leaderboard = leaderboard_model.Leaderboard(
            leaderboard_name=leaderboard_name,
            picture=None,
            is_active=True,
            invite_code=generate_unique_code(),
            owner=owner
        )
    except ValidationError as exc:
        raise HTTPException(
            status_code=400, detail=f"{repr(exc.errors()[0]['msg'])}"
        )

    try:
        await leaderboard.create()
        return leaderboard
    except:
        raise HTTPException(
            status_code=400, detail="Unable to create log at this time."
        )

@leaderboard_router.get("/owned", operation_id="get_owned_leaderboards", response_model=list[leaderboard_schema.Leaderboard])
async def get_owned_leaderboards(
    limit: int | None = 10,
    offset: int | None = 0,
    owner: user_model.User = Depends(get_current_active_user)
):
    """
    Get all leaderboards for current user

    ** Restricted to current user **
    """
    leaderboards = await leaderboard_model.Leaderboard.find(leaderboard_model.Leaderboard.owner.uuid == owner.uuid, fetch_links=True).to_list()
    return leaderboards

@leaderboard_router.get("/joined", operation_id="get_joined_leaderboards", response_model=list[leaderboard_schema.Leaderboard])
async def get_joined_leaderboards(
    limit: int | None = 10,
    offset: int | None = 0,
    owner: user_model.User = Depends(get_current_active_user)
):
    """
    Get all leaderboards for current user

    ** Restricted to current user **
    """
    leaderboards = await leaderboard_model.Leaderboard.find(leaderboard_model.Leaderboard.users.uuid == owner.uuid, fetch_links=True).to_list()
    return leaderboards

@leaderboard_router.patch("/add", operation_id="add_user", response_model=leaderboard_schema.Leaderboard)
async def add_user(
    invite_code: str,
    owner: user_model.User = Depends(get_current_active_user)
):
    leaderboard = await leaderboard_model.Leaderboard.find_one(leaderboard_model.Leaderboard.invite_code == invite_code)
    if leaderboard is None:
        raise HTTPException(status_code=404, detail="Log not found")

    leaderboard.users.append(owner)

    try:
        await leaderboard.save()
        return leaderboard
    except ValidationError:
        raise HTTPException(
            status_code=400, detail=f"Validation error: {ValidationError.errors}"
        )

@leaderboard_router.get("/{leaderboardId}", operation_id="get_leaderboard_data", response_model=list[user_schema.PublicUser])
async def get_leaderboard_data(
    leaderboardId: UUID,
    owner: user_model.User = Depends(get_current_active_user)
):
    leaderboard: leaderboard_model.Leaderboard = await leaderboard_model.Leaderboard.find_one(leaderboard_model.Leaderboard.uuid == leaderboardId, fetch_links=True)

    leaderboard_list = []
    for user in leaderboard.users:
        logs = await log_model.Log.find(log_model.Log.owner.uuid == user.uuid).to_list()
        total_hours = timedelta(hours = 0)
        for log in logs:
            total_hours += log.total_hours

        public_user = user_schema.PublicUser(
            first_name=user.first_name,
            last_name=user.last_name,
            nick_name=user.nick_name,
            picture=user.picture,
            hours=str(total_hours)
        )

        leaderboard_list.append(public_user)

    return leaderboard_list



### TODO - build calls for delete/edit/remove