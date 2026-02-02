from app.view.user_view import (
    create_user_view,
    log_in_user_view
)
from app.crud.crud import get_profiles
from app.view.profile_view import activate_user_profile_view
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm 
from app.db.deps import get_db, get_current_user
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



api_router = APIRouter(prefix="/users",tags=["User"])


@api_router.post(
    "/{user}/create", response_model=ProfileCreateResponse | ProfileCreateErrors
)
async def create_user(
    data: ProfileCreateRequest, session: AsyncSession = Depends(get_db))-> ProfileCreateResponse | ProfileCreateErrors:
    return await create_user_view(session=session, data=data)


@api_router.post("/{user}/activate", response_model=UserCreateResponse)
async def activate_user(
    data: UserCreateRequest, session: AsyncSession = Depends(get_db))-> UserCreateResponse:
    return await activate_user_profile_view(
        session=session, password=data.password, email=data.email, login=data.login
    )


@api_router.post('/login/user', response_model=UserLoginResponse)
async def user_login(data: UserLoginRequest, session: AsyncSession = Depends(get_db)) -> UserLoginResponse:
    result = await log_in_user_view(data=data,session=session)
    return {
        "access_token": result.access_token,
        "token_type": result.token_type,
        "user": result.user
        }


@api_router.get("/users")
async def fetch_users(session: AsyncSession = Depends(get_db)):
    profiles = await get_profiles(session)
    return profiles
