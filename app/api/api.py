from fastapi import APIRouter
from app.api.health_check import api_router as health
from app.api.routers.user_router import api_router as user
from app.api.routers.auth_router import api_router as auth_user
from app.api.routers.profile_router import api_router as profile
from app.api.routers.manager_router import api_router as manager

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(profile)
api_router.include_router(health)
api_router.include_router(user)
api_router.include_router(auth_user)
api_router.include_router(manager)
