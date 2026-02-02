from fastapi import APIRouter, Depends
from app.db.deps import get_current_user
from app.db.models.user import User



api_router = APIRouter(prefix="/profile", tags=["Profile"])

@api_router.get("/")
async def get_me(current_user: User = Depends(get_current_user)):
    return f"Hello, {current_user.profile.name}"