from typing import List

from decouple import config
import secrets
from pydantic import AnyHttpUrl, EmailStr
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    REFRESH_SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8   # 8 days
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl | str] = [
        # "http://localhost:3000/"
        "*",
        "http://0.0.0.0:3000/",
        "http://localhost:3000/",
        "https://1khours.com/",
        "http://1khours.com/"
    ]
    PROJECT_NAME: str = "1kOutside"

    MONGO_CONNECTION_STRING: str = config("MONGO_CONNECTION_STRING", cast=str)

    FIRST_SUPERUSER: EmailStr = config("FIRST_SUPERUSER", cast=str)
    FIRST_SUPERUSER_PASSWORD: str = config("FIRST_SUPERUSER_PASSWORD", cast=str)
    FIRST_SUPERUSER_NICKNAME: str = config("FIRST_SUPERUSER_NICKNAME", cast=str)

    class Config:
        case_sensitive = True

settings = Settings()
