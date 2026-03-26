from logger import logger
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date, time
from enums.lesson import Format, LessonType
from app.errors.user_errors import (
    UserNotFound,
    UserNotTeacher,
    UserTeacher,
)
from app.services.manager_service import (
    fetch_all_students_service,
    fetch_all_teachers_service,
    add_schedule_service,
    add_student_to_lesson_service,
    delete_user_service,
    delete_schedule_service,
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
    start_time: time,
    finish_time: time,
    teacher_login: str,
    days:list[int],
    format: Format,
    type: LessonType,
    session: AsyncSession,
    color: str | None,
    start_date: date,
    finish_date: date
):
    try:
        return await add_schedule_service(
            start_time=start_time,
            finish_time=finish_time,
            teacher_login=teacher_login,
            days=days,
            format=format,
            type=type,
            session=session,
            color=color,
            start_date=start_date,
            finish_date=finish_date
        )
    except UserNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Учитель не найден, проверьте имя или фамилию",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Произошла ошибка. Пожалуйста, попробуйте позже",
        )


async def add_student_to_lesson_view(
    login: str, lesson_id: str, session: AsyncSession
) -> AddScheduleResponse:
    try:
        result = await add_student_to_lesson_service(
            session=session, login=login, lesson_id=lesson_id
        )

    except UserTeacher:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Пользователь должен быть учителем"
        )

    except UserNotFound:
        logger.error(msg=f"User {login} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )

    except Exception as error:
        logger.error(error)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Произошла ошибка. Пожалуйста, попробуйте позже",
        )

    
    return AddScheduleResponse(message="Success")


async def delete_user_view(login: str, session: AsyncSession):
    try:
        return await delete_user_service(login=login, session=session)
    except UserNotFound:
        logger.error(msg=f"User {login} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )


async def delete_schedule_view(lession_id: str, session: AsyncSession):
    return await delete_schedule_service(session=session, lession_id=lession_id)
