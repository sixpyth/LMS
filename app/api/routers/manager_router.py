from fastapi import APIRouter, Depends
from app.db.deps import role_required, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User
from app.crud.crud import get_profiles
from app.services.manager_service import add_schedule_service


from app.view.user_view import (
    create_user_view,
    log_in_user_view
)
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy import select
from app.schemas.user_schemas import (
    ProfileCreateRequest,
    ProfileCreateResponse,
    ProfileCreateErrors,

)

from app.db.models.user import User


api_router = APIRouter(prefix='/manager', tags=["Manager"])

@api_router.get("/manager")
async def check_role(session:AsyncSession = Depends(get_db),current_user: User = Depends(role_required(["ADMIN"]))):
    result = "ok"
    return await get_profiles(db=session)


@api_router.get("/set-schedule")
async def add_schedule(start, finish, login, format, type, session: AsyncSession = Depends(get_db)):
    result = await add_schedule_service(session=session,start=start,finish=finish,login=login, format=format, type=type)
    return result


@api_router.get("/get-user")
async def get_user(login, session: AsyncSession = Depends(get_db)):
    role = select(User).options(selectinload(User.profile)).where(User.login == login)
    result = await session.execute(role)
    user = result.scalar_one_or_none()
    print(user.profile.roles.role)