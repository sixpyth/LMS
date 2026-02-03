from sqlalchemy.ext.asyncio import AsyncSession
from app.services.manager_service import (
    fetch_all_students_service,
    fetch_all_teachers_service,
)


async def fetch_all_students_view(profile_type,session: AsyncSession):
    result = await fetch_all_students_service(profile_type=profile_type,session=session)
    return result


async def fetch_all_teachers_view(profile_type,session: AsyncSession):
    result = await fetch_all_teachers_service(profile_type=profile_type,session=session)
    return result