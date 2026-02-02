from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from app.db.models.user import User
from app.db.models.profile import Profile
from app.db.models.invite_token import Token
from app.schemas.user_schemas import ProfileCreateRequest
from utils.auth_generator import generate_token
from sqlalchemy import func


async def create(db: AsyncSession, login: str, profile: ProfileCreateRequest):
    user = User(login=login)
    db.add(user)
    await db.flush()
    profile = Profile(
        name=profile.name, surname=profile.surname, phone=profile.phone, user_id=user.id
    )
    db.add(profile)
    await db.flush()
    token = Token(token=generate_token(),user_id=user.id)
    db.add(token)
    return user, profile


async def get_user(db: AsyncSession, login: str) -> User | None:
    result = await db.execute(select(User).options(joinedload(User.profile)).where(User.login == login))
    return result.scalar_one_or_none()


async def get_profiles(db: AsyncSession, skip: int = 0, limit: int = 10):
   
    info = select(Profile.name, Profile.surname, Profile.profile_type, User.status).offset(skip).limit(limit)
    result = await db.execute(info)

    user_count = select(func.count(User.id)) 
    users = await db.execute(user_count)
    count = users.scalar() 

    profiles = f"User number: {count}",[
        {"name": row.name, "surname": row.surname, "profile_type": row.profile_type,"status":row.status}
        for row in result.all()
    ]
    return profiles


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
        return None
    await db.delete(user)
    return user
