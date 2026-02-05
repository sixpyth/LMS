from app.db.database import AsyncSessionLocal
from fastapi import Depends, HTTPException

from app.db.models.user import User
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordBearer
from app.core.constants.constants import ALGORITHM
from starlette import status
from enum import Enum
import jwt

SECRET_KEY = "supersecretkey"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login/user")


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


async def get_current_user(
    session: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        print(payload, "__________________________________-")
        login: str = payload.get("sub")
        if login is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        result = (
            select(User).options(joinedload(User.profile)).where(User.login == login)
        )
        get_user = await session.execute(result)
        user = get_user.scalar_one_or_none()
        if not user:
            result
            return HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
            )
        return user
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )


def role_required(session: AsyncSession = Depends(get_db), allowed_role=list[Enum]):
    async def wrapper():
        user: User = await get_current_user(session=session)
        if user.status not in allowed_role:
            return user.id

    return wrapper
