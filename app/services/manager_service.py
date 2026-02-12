from sqlalchemy import DateTime, UUID, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.lesson import Lesson
from app.db.models.lessons_students import LessonStudents
from app.crud.crud import get_user, get_profiles, delete
from enums.lesson import LessonType, Format
from sqlalchemy.orm import selectinload
from app.errors.user_errors import UserNotFound
from sqlalchemy.exc import NoResultFound
from app.db.models.user import User
from app.db.models.profile import Profile


async def add_schedule_service(
    session: AsyncSession,
    start: DateTime,
    finish: DateTime,
    teacher_login: str,
    format: Format,
    type: LessonType,
    color: str | None,
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
        teacher_id=teacher_id,
        type=type,
        format=format,
        color=color
    )
    session.add(lesson)
    await session.commit()
    return user.profile.surname


async def add_student_to_lesson_service(
    session: AsyncSession, student: str, lesson_id: UUID
):
    """
    Add one student to a chosen lesson
    """
    student = await get_user(db=session, login=student)
    lesson = LessonStudents(lesson_id=lesson_id, profile_id=student.id)
    session.add(lesson)
    await session.commit()
    return "Success"


async def fetch_all_students_service(
    limit: int, skip: int, session: AsyncSession, profile_type
):
    """
    Returns a number of all students.
    Used in manager's dashboard
    """
    return await get_profiles(
        limit=limit, skip=skip, db=session, profile_type=profile_type
    )


async def fetch_all_teachers_service(
    limit: int, skip: int, session: AsyncSession, profile_type
):
    """
    Returns a number of all teachers.
    Used in manager's dashboard
    """
    return await get_profiles(
        db=session, skip=skip, limit=limit, profile_type=profile_type
    )


async def fetch_all_schedule_service(skip: int, limit: int, session: AsyncSession):
    """
    Returns the shedule for calendar
    """

    query = select(Lesson).options(selectinload(Lesson.teacher))
    result = await session.execute(query)
    lessons = result.scalars().all()

    profiles = [
        {
            "start": row.start_time,
            "finish": row.finish_time,
            "lesson_type": row.type,
            "lesson_format": row.format,
            "teacher": row.teacher.name,
            "color": row.color,
            "lesson_id": row.id
        }
        for row in lessons
    ]

    return {
        "schedule": profiles,
    }


async def delete_user_service(login: str, session: AsyncSession):
    """
    Deletes the user by login
    """
    await delete(db=session, login=login)
    return "Успешно удален"


async def delete_schedule_service(session: AsyncSession, lession_id:str):
    """
    Deletes the chose schedule
    """

    query = select(Lesson).where(Lesson.id==lession_id)
    result = await session.execute(query)
    lesson = result.scalar_one_or_none()
    await session.delete(lesson)
    await session.commit()
    return "Урок успешно удален"
