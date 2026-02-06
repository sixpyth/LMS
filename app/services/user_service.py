from app.validators.personal_info_validator import (
    validate_info,
    is_email_exists,
    is_phone_num_exists
)

from enums.profile_type import ProfileType
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from utils.jwt_generator import generate_jwt_token
from app.core.constants.constants import ACCESS_TOKEN_EXPIRE_MINUTES
from app.errors.user_errors import (
    PhoneNumberExists,
    WrongInfoInput,
    WrongPersonalInfoValidation,
    UserNotFound,
    WrongCredentials,
    NoPasswordFound,
)

from utils.hash_password import verify_password
from utils.auth_generator import login_generator
from app.crud.crud import create
from app.db.database import AsyncSessionLocal as async_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.errors.user_errors import UserAlreadyExists
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.db.models.user import User
from app.db.models.profile import Profile
from logger import logger


# async def is_email_exists(session, email):
#     result = await session.execute(select(Profile).where(Profile.phone == email))


# async def is_phone_num_exists(session: AsyncSession, phone: str) -> bool:
#     async with async_session() as session:
#         result = await session.execute(select(Profile).where(Profile.phone == phone))
#         phone = result.scalar_one_or_none()
#         return phone is not None


async def create_teacher_service(session: AsyncSession, data):

    login = login_generator(data.name, data.surname)

    try:
        validate_info(data.name, data.surname, data.phone)
    except WrongPersonalInfoValidation as e:
        raise WrongInfoInput(errors=e.errors)

    if await is_phone_num_exists(session=session, phone=data.phone):
        raise PhoneNumberExists()

    try:
        user, profile = await create(db=session, login=login, profile=data)
        profile.profile_type = ProfileType.TEACHER
        await session.commit()
    except IntegrityError as e:
        logger.error(e)
        await session.rollback()
        raise UserAlreadyExists()

    return f"Учитель {profile.surname} {profile.name} был успешно добавлен!"


async def create_user_service(session: AsyncSession, data):

    login = login_generator(data.name, data.surname)

    try:
        validate_info(data.name, data.surname, data.phone)
    except WrongPersonalInfoValidation as e:
        raise WrongInfoInput(errors=e.errors)

    if await is_phone_num_exists(session=session, phone=data.phone) is True:
        raise PhoneNumberExists()

    try:
        user, profile = await create(db=session, login=login, profile=data)
        await session.commit()
    except IntegrityError as e:
        logger.error(e)
        await session.rollback()
        raise UserAlreadyExists()

    return f"Студент {profile.surname} {profile.name} был успешно добавлен!"


async def log_in_user_service(
    data: OAuth2PasswordRequestForm, session: AsyncSession
) -> tuple:
    result = await session.execute(
        select(User)
        .options(joinedload(User.profile))
        .where(User.login == data.username)
    )
    try:
        user = result.scalar_one()
    except NoResultFound:
        raise UserNotFound()
    if user.password_hash is None:
        raise NoPasswordFound()

    if not verify_password(data.password, user.password_hash):
        raise WrongCredentials()
    token = generate_jwt_token(
        data={"sub": user.login},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return user.profile, token
