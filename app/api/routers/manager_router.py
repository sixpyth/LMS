from fastapi import APIRouter, Depends
from app.db.deps import role_required, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User
from app.crud.crud import get_profiles
from app.services.manager_service import add_schedule_service
from enum import Enum
from enums.profile_type import ProfileType

from app.view.manager_view import fetch_all_students_view, fetch_all_teachers_view

from sqlalchemy.orm import selectinload
from sqlalchemy import select


api_router = APIRouter(prefix="/manager", tags=["Manager"])


@api_router.get("/manager")
async def check_role(
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(role_required(["ADMIN"])),
):
    result = "ok"
    return await get_profiles(db=session)


@api_router.post("/set-schedule")
async def add_schedule(
    start, finish, login, format, type, session: AsyncSession = Depends(get_db)
):
    result = await add_schedule_service(
        session=session,
        start=start,
        finish=finish,
        login=login,
        format=format,
        type=type,
    )
    return result


@api_router.get("/get-user")
async def get_user(login, session: AsyncSession = Depends(get_db)):
    role = select(User).options(selectinload(User.profile)).where(User.login == login)
    result = await session.execute(role)
    user = result.scalar_one_or_none()
    print(user.profile.roles.role)


@api_router.get("/get-students")
async def get_students(profile_type: ProfileType = ProfileType.STUDENT ,session: AsyncSession = Depends(get_db)):
    result = await fetch_all_students_view(profile_type=profile_type,session=session)
    return result


@api_router.get("/get-teachers")
async def get_teachers(profile_type: ProfileType = ProfileType.TEACHER,session: AsyncSession = Depends(get_db)):
    result = await fetch_all_teachers_view(profile_type=profile_type,session=session)
    return result
