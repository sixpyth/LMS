from sqlalchemy import DateTime, UUID, select, Date, Time
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.lesson import Lesson
from app.db.models.lessons_students import LessonStudents
from app.crud.crud import get_user, get_profiles, delete
from enums.lesson import LessonType, Format
from sqlalchemy.orm import selectinload
from app.errors.user_errors import UserNotFound
from sqlalchemy.exc import NoResultFound
from app.db.models.user import User
from app.db.models.day import Days
from enums.profile_type import ProfileType
from app.errors.user_errors import (
    UserNotTeacher,
    UserTeacher,
)


async def add_schedule_service(
    session: AsyncSession,
    start_time: Time,
    finish_time: Time,
    teacher_login: str,
    format: Format,
    type: LessonType,
    color: str | None,
    days: list[int],
    start_date: Date,
    finish_date: Date,
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

    # add all days from the list in the database
    lesson = Lesson(
        start_time=start_time,
        finish_time=finish_time,
        teacher_id=teacher_id,
        type=type,
        format=format,
        color=color,
        start_date=start_date,
        finish_date=finish_date
    )
    session.add(lesson)
    for day in days:
        session.add(Days(days=day, lesson=lesson))
    await session.flush()
    await session.commit()
    return user.profile.surname


async def add_student_to_lesson_service(
    session: AsyncSession, login: str, lesson_id: UUID
):
    """
    Add one student to a chosen lesson
    """
    student: User = await get_user(db=session, login=login)

    if student is None:
        raise UserNotFound()

    if student.profile.profile_type is ProfileType.TEACHER:
        raise UserTeacher()

    lesson = LessonStudents(lesson_id=lesson_id, user_id=student.id)
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

    query = select(Lesson).options(
        selectinload(Lesson.teacher), selectinload(
            Lesson.students).selectinload(LessonStudents.user), selectinload(Lesson.days), selectinload(Lesson.days)
    )
    result = await session.execute(query)
    lessons = result.scalars().all()

    profiles = [
        {
            "start_time": row.start_time,
            "finish_time": row.finish_time,
            "start_date": row.start_date,
            "finish_date": row.finish_date,
            "lesson_type": row.type,
            "lesson_format": row.format,
            "teacher": row.teacher.name,
            "students": [
                {
                    "name": student.user.profile.name,
                    "surname": student.user.profile.surname,
                    "login": student.user.login,
                }
                for student in row.students
            ],
            "days": [
                {
                    "day": day.days
                }
                for day in row.days
            ],
            "color": row.color,
            "lesson_id": row.id,
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


async def delete_schedule_service(session: AsyncSession, lession_id: str):
    """
    Deletes the chose schedule
    """

    query = select(Lesson).where(Lesson.id == lession_id)
    result = await session.execute(query)
    lesson = result.scalar_one_or_none()
    await session.delete(lesson)
    await session.commit()
    return "Урок успешно удален"
