from fastapi import APIRouter
from app.api.v1.routes.users import user_router
from app.api.v1.routes.logs import log_router
from app.api.auth.jwt import auth_router

router = APIRouter()

router.include_router(user_router, prefix="/users", tags=["users"])
router.include_router(auth_router, prefix='/auth', tags=["auth"])
router.include_router(log_router, prefix="/logs", tags=["logs"])