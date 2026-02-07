from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from enums.lesson import Format, LessonType
from app.errors.user_errors import UserNotFound

from app.services.manager_service import (
    fetch_all_students_service,
    fetch_all_teachers_service,
    add_schedule_service,
    add_student_to_lesson_service,
)
from app.schemas.manager_schemas import (
    AddScheduleResponse,
)
from starlette import status
from fastapi import HTTPException


async def fetch_all_students_view(
    skip: int, limit: int, profile_type, session: AsyncSession
):
    result = await fetch_all_students_service(
        limit=limit, skip=skip, profile_type=profile_type, session=session
    )
    return result


async def fetch_all_teachers_view(
    skip: int, limit: int, profile_type, session: AsyncSession
):
    result = await fetch_all_teachers_service(
        skip=skip, limit=limit, profile_type=profile_type, session=session
    )
    return result


async def add_schedule_view(
    start: datetime,
    finish: datetime,
    teacher_login: str,
    format: Format,
    type: LessonType,
    session: AsyncSession,
):
    try:
        return await add_schedule_service(
            start=start,
            finish=finish,
            teacher_login=teacher_login,
            format=format,
            type=type,
            session=session,
        )
    except UserNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Учитель не найден, проверьте имя или фамилию",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Произошла ошибка. Пожалуйста, попробуйте позже",
        )


async def add_student_to_lesson_view(
    profile_type, session: AsyncSession
) -> AddScheduleResponse:
    try:
        result = await add_student_to_lesson_service(
            profile_type=profile_type, session=session
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Произошла ошибка. Пожалуйста, попробуйте позже",
        )

    return AddScheduleResponse(message="Success")
