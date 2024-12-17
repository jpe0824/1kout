from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from app.core.security import create_access_token, create_refresh_token
from app.schemas.auth_schema import TokenSchema
from app.schemas import user_schema
from app.models import user_model
from app.api.deps.user_deps import get_current_user, get_user_by_id, authenticate_user
from app.core.config import settings
from app.schemas.auth_schema import TokenPayload
from pydantic import ValidationError
import jwt

auth_router = APIRouter()


@auth_router.post('/login', operation_id="login", summary="Create access and refresh tokens for user", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = await authenticate_user(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    return {
        "access_token": create_access_token(user.uuid),
        "refresh_token": create_refresh_token(user.uuid),
    }


@auth_router.post('/test-token', operation_id="test_token", summary="Test if the access token is valid", response_model=user_schema.User)
async def test_token(user: user_model.User = Depends(get_current_user)):
    return user


@auth_router.post('/refresh', operation_id="refresh", summary="Refresh token", response_model=TokenSchema)
async def refresh_token(refresh_token: str = Body(...)):
    try:
        payload = jwt.decode(
            refresh_token, settings.REFRESH_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.DecodeError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (jwt.ExpiredSignatureError):
        raise HTTPException(
            status_code = status.HTTP_403_FORBIDDEN,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await get_user_by_id(token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid token for user",
        )
    return {
        "access_token": create_access_token(user.uuid),
        "refresh_token": create_refresh_token(user.uuid),
    }