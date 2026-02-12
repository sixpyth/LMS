from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.db.models.user import User
from app.db.models.profile import Profile
from app.db.models.invite_token import Token
from app.schemas.user_schemas import ProfileCreateRequest
from utils.auth_generator import generate_token
from sqlalchemy import func
from enums.profile_type import ProfileType
from app.errors.user_errors import UserNotFound


async def create(db: AsyncSession, login: str, profile: ProfileCreateRequest):
    user = User(login=login)
    db.add(user)
    await db.flush()
    profile = Profile(
        name=profile.name, surname=profile.surname, phone=profile.phone, user_id=user.id
    )
    db.add(profile)
    await db.flush()
    token = Token(token=generate_token(), user_id=user.id)
    db.add(token)
    return user, profile


async def get_user(db: AsyncSession, login: str) -> User | None:
    result = await db.execute(
        select(User).options(joinedload(User.profile)).where(User.login == login)
    )
    return result.scalar_one_or_none()


async def get_profiles(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 5,
    profile_type: ProfileType | None = None,
):
    """Returns all users with the chosen profile type"""
    query = select(
        Profile.name, Profile.surname, Profile.profile_type, User.login, User.status
    ).join(User)

    if profile_type:
        query = query.where(Profile.profile_type == profile_type)

    query = query.offset(skip).limit(limit)

    result = await db.execute(query)

    count_query = select(func.count(User.id))
    if profile_type:
        count_query = count_query.join(Profile).where(
            Profile.profile_type == profile_type
        )

    total = (await db.execute(count_query)).scalar()

    profiles = [
        {
            "name": row.name,
            "surname": row.surname,
            "profile_type": row.profile_type,
            "status": row.status,
            "login":row.login
        }
        for row in result.all()
    ]

    return {
        "count": total,
        "profiles": profiles,
    }


async def update(db: AsyncSession, login: int, user_data):
    user = await get_user(db, login)
    if not user:
        return None
    for key, value in user_data.items():
        if value is not None:
            setattr(user, key, value)
    await db.refresh(user)
    return user


async def delete(db: AsyncSession, login: int):
    user = await get_user(db, login)
    if not user:
        raise UserNotFound()
    await db.delete(user)
    await db.commit()
    return user
