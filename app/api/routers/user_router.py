from app.view.user_view import create_user_view, log_in_user_view, create_teacher_view
from app.view.profile_view import activate_user_profile_view
from app.crud.crud import get_profiles
from fastapi import APIRouter, Depends
from app.db.deps import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user_schemas import (
    ProfileCreateRequest,
    ProfileCreateResponse,
    ProfileCreateErrors,
    UserCreateResponse,
    UserCreateRequest,
)
from app.schemas.user_schemas import (
    UserLoginResponse,
    UserLoginRequest,
)


api_router = APIRouter(prefix="/users", tags=["User"])


@api_router.post(
    "/{user}/create", response_model=ProfileCreateResponse | ProfileCreateErrors
)
async def create_student(
    data: ProfileCreateRequest, session: AsyncSession = Depends(get_db)
) -> ProfileCreateResponse | ProfileCreateErrors:
    result = await create_user_view(session=session, data=data)
    return ProfileCreateResponse(message=result)


@api_router.post(
    "/{user}/teaher-create", response_model=ProfileCreateResponse | ProfileCreateErrors
)
async def create_teacher(
    data: ProfileCreateRequest, session: AsyncSession = Depends(get_db)
) -> ProfileCreateResponse | ProfileCreateErrors:
    result = await create_teacher_view(session=session, data=data)
    return ProfileCreateResponse(message=result)


@api_router.post("/{user}/activate", response_model=UserCreateResponse)
async def activate_user(
    data: UserCreateRequest, session: AsyncSession = Depends(get_db)
) -> UserCreateResponse:
    return await activate_user_profile_view(
        session=session, password=data.password, email=data.email, login=data.login
    )


@api_router.post("/login/user", response_model=UserLoginResponse)
async def user_login(
    data: UserLoginRequest, session: AsyncSession = Depends(get_db)
) -> UserLoginResponse:
    result = await log_in_user_view(data=data, session=session)
    return {
        "access_token": result.access_token,
        "token_type": result.token_type,
        "user": result.user,
    }
