from fastapi import APIRouter
from app.db.deps import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends
from app.services.token_service import is_token_valid

api_router = APIRouter(prefix="/auth", tags=["Auth"])

@api_router.get("/invite/{token}")
async def auth_user(token, session: AsyncSession = Depends(get_db)):
    return await is_token_valid(session=session, token=token)