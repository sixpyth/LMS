from enums.user_status import UserStatus
from pydantic import EmailStr
from app.db.models.profile import Profile
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.crud import get_user
from utils.hash_password import hash_password
from app.errors.password_errors import WrongPasswordInput, WrongPasswordValidation
from app.errors.user_errors import UserNotFound
from app.validators.password_validator import password_validator


async def get_profile(session: AsyncSession, login: str):
    profile = session.get(Profile, login)
    return profile


async def activate_user_profile_service(
    session: AsyncSession, password: str, email: EmailStr, login: str
):
    try:
        password_validator(password=password)
    except WrongPasswordValidation as errors:
        raise WrongPasswordInput(errors=errors.errors)

    hashed_password = hash_password(password=password)

    user = await get_user(db=session, login=login)
    if user is None:
        raise UserNotFound()

    user.email = email
    user.password_hash = hashed_password
    user.status = UserStatus.ACTIVE
    await session.commit()

    return f"Аккаунт {login} успешно активирован"


def set_profile_avatar_serivce(type: str, size: float):
    valid_type = [".jpg", ".png"]
    if not any(validator in type for validator in valid_type):
        return "Wrong profile type"
    else:
        return "Успешно загружено"


print(set_profile_avatar_serivce("profileavar.png", 12.02))
