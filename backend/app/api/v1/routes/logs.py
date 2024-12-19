from typing import Any
from uuid import UUID
from datetime import datetime

from beanie.exceptions import RevisionIdWasChanged
from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic import ValidationError
from pymongo import errors

from app.models import log_model
from app.models import user_model
from app.schemas import log_schema
from app.api.deps.user_deps import get_current_active_user

log_router = APIRouter()

@log_router.post("", operation_id="create_log", response_model=log_schema.Log)
async def create_log(
    start_time: datetime = Body(...),
    end_time: datetime = Body(...),
    owner: user_model.User = Depends(get_current_active_user)
):
    """
    Create new log for user.

    ** Restricted to current user **

    Parameters
    ----------
    start_time: datetime
        entered start datetime

    end_time: datetime
        entered end datetime

    Returns
    -------
    schemas.Log
        Log info
    """
    try:
        log = log_model.Log(
            start_time=start_time,
            end_time=end_time,
            owner=owner
        )
    except ValidationError as exc:
        raise HTTPException(
            status_code=400, detail=f"{repr(exc.errors()[0]['msg'])}"
        )

    try:
        await log.create()
        return log

    except:
        raise HTTPException(
            status_code=400, detail="Unable to create log at this time."
        )

@log_router.get("/", operation_id="got_logs", response_model=list[log_schema.Log])
async def get_logs(
    limit: int | None = 10,
    offset: int | None = 0,
    owner: user_model.User = Depends(get_current_active_user)
):
    """
    Get all logs for current user

    ** Restricted to current user **
    """
    logs = await log_model.Log.find(log_model.Log.owner.uuid == owner.uuid).skip(offset).limit(limit).to_list()
    return logs

@log_router.get("/{logid}", operation_id="get_log_by_id", response_model=log_schema.Log)
async def get_log(
    logid: UUID,
    owner: user_model.User = Depends(get_current_active_user)
):
    """
    Create new log for user.

    ** Restricted to current user **

    Parameters
    ----------
    logid: UUID
        The logs id

    Returns
    -------
    schemas.Log
        Log info
    """
    log = await log_model.Log.find_one(log_model.Log.uuid == logid, log_model.Log.owner.uuid == owner.uuid)
    if log is None:
        raise HTTPException(status_code=404, detail="Log not found")
    return log

@log_router.patch("/{logid}", operation_id="edit_log", response_model=log_schema.Log)
async def edit_log(
    logid: UUID,
    update: log_schema.LogUpdate,
    owner: user_model.User = Depends(get_current_active_user)
):
    """
    Edit a log for user.

    ** Restricted to current user **

    Parameters
    ----------
    logid: UUID
    update: starttime, endtime

    Returns
    -------
    schemas.Log
        Log info
    """
    log = await log_model.Log.find_one(log_model.Log.uuid == logid, log_model.Log.owner.uuid == owner.uuid)
    if log is None:
        raise HTTPException(status_code=404, detail="Log not found")

    update_data = update.model_dump(exclude_unset=True)
    log = log.model_copy(update=update_data)

    try:
        await log.save()
        return log
    except ValidationError:
        raise HTTPException(
            status_code=400, detail=f"Validation error: {ValidationError.errors}"
        )

@log_router.delete("/{logid}", operation_id="delete_log", response_model=None)
async def delete_log(
    logid: UUID,
    owner: user_model.User = Depends(get_current_active_user)
):
    """
    Delete a log.

    ** Restricted to current user **

    Parameters
    ----------
    logid: UUID

    Returns
    -------
    None
    """
    log = await log_model.Log.find_one(log_model.Log.uuid == logid, log_model.Log.owner.uuid == owner.uuid)
    if log is None:
        raise HTTPException(status_code=404, detail="Log not found")

    await log.delete()
    return None