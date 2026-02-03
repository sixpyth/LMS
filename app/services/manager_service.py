from sqlalchemy import DateTime
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User
from app.crud.crud import get_user, get_profiles


async def add_schedule_service(
    session: AsyncSession, start: DateTime, finish: DateTime, login: User, format, type
):
    user = await get_user(db=session, login=login)
    return user.profile.surname


async def fetch_all_students_service(session: AsyncSession, profile_type):
    return await get_profiles(db=session,profile_type=profile_type)



async def fetch_all_teachers_service(session: AsyncSession, profile_type):
    return await get_profiles(db=session, profile_type=profile_type)