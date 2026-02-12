from app.validators.personal_info_validator import validate_info, is_phone_num_exists
from app.validators.password_validator import password_validator
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
)
from app.errors.password_errors import (
    NoPasswordFound,
    PasswordAlreadyExists,
    PasswordsNotMatch,
    WrongPasswordInput,
    WrongPasswordValidation,
)
from utils.hash_password import verify_password, hash_password
from utils.auth_generator import login_generator
from app.crud.crud import create, get_user
from sqlalchemy.ext.asyncio import AsyncSession
from app.errors.user_errors import UserAlreadyExists
from sqlalchemy.exc import IntegrityError, NoResultFound
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.db.models.user import User
from logger import logger


async def create_teacher_service(session: AsyncSession, data)->None:

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


async def create_student_service(session: AsyncSession, data)->None:

    login = login_generator(data.name, data.surname)

    try:
        validate_info(data.name, data.surname, data.phone)
    except WrongPersonalInfoValidation as e:
        raise WrongInfoInput(errors=e.errors)

    if await is_phone_num_exists(session=session, phone=data.phone) is True:
        raise PhoneNumberExists()

    for attempt in range(1,5):
        try:
            user, profile = await create(db=session, login=login, profile=data)
            await session.commit()
        except IntegrityError as e:
            logger.error(e)
            await session.rollback()
            new_login = login_generator(name=data.name,surname=data.surname)
            new_login+=str(attempt)
            login = new_login
            continue    
           
        return f"Студент {profile.surname} {profile.name} был успешно добавлен!"


async def log_in_user_service(
    data: OAuth2PasswordRequestForm, session: AsyncSession
) -> tuple[str,str]:
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


async def update_user_password_service(
    data: OAuth2PasswordRequestForm,
    session: AsyncSession,
    current_password: str,
    new_password: str,
    confirm_new_password: str,
)->None:
    user_login = data.login
    user: User = await get_user(db=session, login=user_login)
    if not verify_password(password=current_password, hashed=user.password_hash):
        raise WrongCredentials()
    if new_password != confirm_new_password:
        raise PasswordsNotMatch()
    if new_password == current_password:
        raise PasswordAlreadyExists()
    try:
        password_validator(new_password)
    except WrongPasswordValidation as errors:
        raise WrongPasswordInput(errors=errors.errors)
    hashed_password = hash_password(new_password)
    user.password_hash = hashed_password
    await session.commit()
    return "Пароль был успешно обновлен"
