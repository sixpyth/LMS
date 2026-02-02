from enums.user_status import UserStatus
from pydantic import EmailStr
from app.db.models.profile import Profile
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.crud import get_user
from utils.hash_password import hash_password


async def get_profile(session: AsyncSession, login: str):
    profile = session.get(Profile, login)
    return profile


async def activate_user_profile_service(
    session: AsyncSession, password: str, email: EmailStr, login: str
):

    hashed_password = hash_password(password=password)

    user = await get_user(db=session, login=login)
    print(user)
    user.email = email
    user.password_hash = hashed_password
    user.status = UserStatus.ACTIVE
    await session.commit()

    return "Success"
