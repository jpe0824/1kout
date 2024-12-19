from contextlib import asynccontextmanager

from beanie import init_beanie
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from fastapi.openapi.utils import get_openapi

from app.core.config import settings
from app.api.v1.routers import router
from app.models.user_model import User
from app.models.log_model import Log
from app.core.security import get_password_hash

@asynccontextmanager
async def lifespan(app: FastAPI):
    db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING, tlsCAFile=certifi.where()).onekout

    await init_beanie(
        database=db_client,
        document_models= [
            User,
            Log
        ]
    )

    user = await User.find_one({"email": settings.FIRST_SUPERUSER})
    if not user:
        user = User(
            email=settings.FIRST_SUPERUSER,
            hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
            is_superuser=True,
        )
        await user.create()

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=settings.PROJECT_NAME,
        version="0.0.1",
        description="OpenAPI Schema for 1kOut",
        routes=app.routes,
    )
    openapi_schema["servers"]= [
        {
            "url": f"http://localhost:8000"
        }
    ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

app.include_router(router, prefix=settings.API_V1_STR)