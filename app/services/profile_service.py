from fastapi import UploadFile
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
    try:
        password_validator(password=password)
    except WrongPasswordValidation as errors:
        raise WrongPasswordInput(errors=errors.errors)

    hashed_password = hash_password(password=password)

    user = await get_user(db=session, login=login)
    
    if user.status == UserStatus.ACTIVE:
        raise UserAlreadyActive()

    if user is None:
        raise UserNotFound()

    if await is_email_exists(session=session,email=email):
        raise EmailAlreadyExists()
    

    user.email = email
    user.password_hash = hashed_password
    user.status = UserStatus.ACTIVE
    await session.commit()
    send_email(to=email, subject=subject, body=text)

    return f"Аккаунт {login} успешно активирован"


async def set_profile_avatar_serivce(
    file: UploadFile, session: AsyncSession, current_user: str
):
    AVATAR_DIR = Path("media/profile_pictures")
    AVATAR_DIR.mkdir(parents=True, exist_ok=True)
    valid_type = {".jpg", ".png", ".jpeg"}
    print(file)
    path_avatar = Path(file.filename).suffix.lower()
    if path_avatar not in valid_type:
        return "Error: Wrong profile type"
    content = file.file.read()
    if len(content) > MAX_AVATAR_SIZE:
        return "Error: Avatar's size is massive"

    file_name = f"{uuid4()}{path_avatar}"
    path = AVATAR_DIR / file_name
    print(path)

    with open(path, "wb") as f:
        f.write(content)
    profile: User = await get_user(db=session, login=current_user.login)

    profile.profile.avatar_url = "http://localhost:8000/" + str(path).replace("\\", "/")

    await session.commit()
    return "Успешно загружено"



async def fetch_schedule_service(current_user:User, session: AsyncSession, skip: int = 0, limit: int = 0):
    """
    Returns the shedule for calendar
    """
    if current_user.profile.profile_type == ProfileType.TEACHER:
        query = select(Lesson).options(selectinload(Lesson.teacher)).where(Lesson.teacher_id==current_user.profile.user_id)
    
    elif current_user.profile.profile_type == ProfileType.ADMIN:
        query = select(Lesson).options(selectinload(Lesson.teacher))

    elif current_user.profile.profile_type == ProfileType.STUDENT:
        query = select(LessonStudents).options(selectinload(Lesson)).where(LessonStudents.profile_id ==current_user.profile.user_id)

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
            "lesson_id": row.id,
        }
        for row in lessons
    ]
    return {
        "schedule": profiles,
    }
