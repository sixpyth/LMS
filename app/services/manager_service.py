from sqlalchemy import DateTime, UUID, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.lesson import Lesson
from app.db.models.lessons_students import LessonStudents
from app.crud.crud import get_user, get_profiles, delete
from enums.lesson import LessonType, Format
from app.errors.user_errors import UserNotFound
from sqlalchemy.exc import NoResultFound
from app.db.models.user import User


async def add_schedule_service(
    session: AsyncSession,
    start: DateTime,
    finish: DateTime,
    teacher_login: str,
    format: Format,
    type: LessonType,
):
    """
    Function creates schedule with the chosen teacher/format/type
    (does not include students)
    """
    try:
        user: User = await get_user(db=session, login=teacher_login)
    except NoResultFound:
        raise UserNotFound
    if user is None:
        raise UserNotFound
    teacher_id = user.id
    lesson = Lesson(
        start_time=start,
        finish_time=finish,
        teacher=teacher_id,
        type=type,
        format=format,
    )
    session.add(lesson)
    await session.commit()
    return user.profile.surname


async def add_student_to_lesson_service(
    session: AsyncSession, student: str, lesson_id: UUID
):
    student = await get_user(db=session, login=student)
    lesson = LessonStudents(lesson_id=lesson_id, profile_id=student.id)
    session.add(lesson)
    await session.commit()
    return "Success"


async def fetch_all_students_service(
    limit: int, skip: int, session: AsyncSession, profile_type
):
    return await get_profiles(
        limit=limit, skip=skip, db=session, profile_type=profile_type
    )


async def fetch_all_teachers_service(
    skip: int, limit: int, session: AsyncSession, profile_type
):
    return await get_profiles(
        db=session, skip=skip, limit=limit, profile_type=profile_type
    )


async def fetch_all_schedule_service(skip: int, limit: int, session: AsyncSession):
    query = select(Lesson.start_time, Lesson.finish_time, Lesson.type, Lesson.format)
    result = await session.execute(query)

    profiles = [
        {
            "start": row.start_time,
            "finish": row.finish_time,
            "lesson_type": row.type,
            "lesson_format": row.format,
        }
        for row in result.all()
    ]

    return {
        "schedule": profiles,
    }


async def delete_user_service(login: str, session: AsyncSession):
    await delete(db=session, login=login)
    return "Успешно удален"
