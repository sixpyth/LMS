from sqlalchemy import Select
from app.db.models.invite_token import Token
from app.db.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from enums.user_status import UserStatus
from fastapi import HTTPException
from starlette import status
from datetime import datetime, timezone

now = datetime.now(timezone.utc)

async def is_token_valid(session: AsyncSession, token: Token):
    token = await session.scalar(Select(Token).where(Token.token==token))
    
    if not token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Token not found")
        
    if token.expires_at<now:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Token has expired")

    user = await session.get(User,token.user_id)

    if user.status != UserStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already activated the link")
    
    return user, token