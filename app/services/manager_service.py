from sqlalchemy import select, DateTime
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.profile import Profile
from app.db.models.user import User
from app.db.models.lesson import Lesson
from app.crud.crud import get_user


async def add_schedule_service(session: AsyncSession, start: DateTime, finish: DateTime, login: User, format, type):
    user = await get_user(db=session, login=login)
    return user.profile.surname

    # user = await session.execute(select(User.id).where(User.id==user_id))
    # lesson = Lesson(start_time=start,finish_time = finish, format=format, type=type)
    # print(user, "_______________________________________________________")
    # session.add(lesson)
    # await session.flush()
    # await session.commit()
    # return lesson

