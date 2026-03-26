from datetime import timedelta

from fastapi import UploadFile
# from minio import Minio
from app.core.minio.client import client
from enums.user_status import UserStatus
from enums.profile_type import ProfileType
from pydantic import EmailStr
from app.db.models.profile import Profile
from app.db.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.crud import get_user
from utils.hash_password import hash_password
from app.errors.password_errors import WrongPasswordInput, WrongPasswordValidation
from app.errors.user_errors import (
    UserNotFound,
    EmailAlreadyExists,
    UserAlreadyActive,
)
from app.db.models.lessons_students import LessonStudents
from sqlalchemy.orm import selectinload
from sqlalchemy import select
from app.db.models.lesson import Lesson
from app.validators.password_validator import password_validator
from app.services.email_service import send_email
from app.templates.email_template import email_template
from app.core.constants.constants import (
    MAX_AVATAR_SIZE,
)
from enums.user_status import UserStatus
from pathlib import Path
from uuid import uuid4
from app.validators.personal_info_validator import is_email_exists


subject, text, html = email_template()

async def get_profile(session: AsyncSession, login: str):
    profile = session.get(Profile, login)
    return profile


async def activate_profile_service(
    session: AsyncSession, password: str, email: EmailStr, login: str
):
    user = await get_user(db=session, login=login)

    if user is None:
        raise UserNotFound()

    try:
        await password_validator(password=password)
    except WrongPasswordValidation as errors:
        raise WrongPasswordInput(errors=errors.errors)

    hashed_password = hash_password(password=password)

    if user.status == UserStatus.ACTIVE:
        raise UserAlreadyActive()

    if await is_email_exists(session=session, email=email):
        raise EmailAlreadyExists()

    user.email = email
    user.password_hash = hashed_password
    user.status = UserStatus.ACTIVE
    await session.commit()
    send_email(to=email, subject=subject, body=text)

    return f"Аккаунт {login} успешно активирован"


async def set_profile_picture_serivce(
    file: UploadFile, session: AsyncSession, current_user: str
):
    
    file.file.seek(0,2)
    size = file.file.tell()
    file.file.seek(0)
    if size>MAX_AVATAR_SIZE:
        return "Error: Avatar's size is massive"
    object_name = f"{current_user.id}.jpg"
    client.put_object(
        "avatars",
        object_name=object_name,
        data=file.file,
        length=-size,
        part_size=10*1024*1024
    )
    user: User = await get_user(db=session, login=current_user.login)
    user.profile.avatar_url = object_name
    await session.commit()
    return {"avatar_url":object_name}
    # return "Успешно загружено"

async def get_avatar_url(key: str):
    object_name = key.replace("avatars/", "")
    return client.presigned_get_object(
        "avatars",
        object_name,
        expires=timedelta(minutes=10)
    )

async def fetch_schedule_service(
    current_user: User, session: AsyncSession, skip: int = 0, limit: int = 0
):
    """
    Returns the shedule for calendar
    """
    if current_user.profile.profile_type == ProfileType.TEACHER:
        query = select(Lesson).options(
            selectinload(Lesson.teacher), selectinload(
                Lesson.students).selectinload(LessonStudents.user), selectinload(Lesson.days)).where(Lesson.teacher_id == current_user.id)

    elif current_user.profile.profile_type == ProfileType.ADMIN:
        query = select(Lesson).options(
            selectinload(Lesson.teacher), selectinload(
                Lesson.students).selectinload(LessonStudents.user), selectinload(Lesson.days), selectinload(Lesson.days)
        )

    elif current_user.profile.profile_type == ProfileType.STUDENT:
        query = (
            select(Lesson)
            .join(LessonStudents)
            .options(
                selectinload(Lesson.teacher)
                .selectinload(Profile.user),

                selectinload(Lesson.students)
                .selectinload(LessonStudents.user),

                selectinload(Lesson.days),
            )
            .where(LessonStudents.user_id == current_user.profile.user_id)
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
            "days": [{"day": day.days} for day in row.days],
            "color": row.color,
            "lesson_id": row.id,
        }
        for row in lessons
    ]
    return {
        "schedule": profiles,
    }
