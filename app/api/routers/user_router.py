from app.view.user_view import (
    create_user_view,
    log_in_user_view,
    create_teacher_view,
    update_user_password_view,
)
from app.view.profile_view import activate_user_profile_view
from fastapi import APIRouter, Depends
from app.db.deps import get_db, get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from app.db.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user_schemas import (
    ProfileCreateRequest,
    ProfileCreateResponse,
    ProfileCreateErrors,
    UserCreateResponse,
    UserCreateRequest,
    UpdatePasswordRequest,
    UpdatePasswordResponse,
)


api_router = APIRouter(prefix="/users", tags=["User"])


@api_router.post("/{user}/create", response_model=ProfileCreateResponse)
async def create_student(
    request: ProfileCreateRequest, session: AsyncSession = Depends(get_db)
) -> ProfileCreateResponse:
    result = await create_user_view(session=session, data=request)
    return result


@api_router.post(
    "/{user}/teaher-create", response_model=ProfileCreateResponse | ProfileCreateErrors
)
async def create_teacher(
    request: ProfileCreateRequest, session: AsyncSession = Depends(get_db)
) -> ProfileCreateResponse | ProfileCreateErrors:
    result = await create_teacher_view(session=session, data=request)
    return ProfileCreateResponse(message=result)


@api_router.post("/{user}/activate", response_model=UserCreateResponse)
async def activate_user(
    request: UserCreateRequest, session: AsyncSession = Depends(get_db)
) -> UserCreateResponse:
    return await activate_user_profile_view(
        session=session,
        password=request.password,
        email=request.email,
        login=request.login,
    )


# @api_router.post("/login/user", response_model=UserLoginResponse)
# async def user_login(
#     request: UserLoginRequest, session: AsyncSession = Depends(get_db)
# ) -> UserLoginResponse:
#     result = await log_in_user_view(data=request, session=session)
#     return {
#         "access_token": result.access_token,
#         "token_type": result.token_type,
#         "user": result.user,
#     }


@api_router.patch("/update-password", response_model=UpdatePasswordResponse)
async def user_password_update(
    request: UpdatePasswordRequest,
    data: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    await update_user_password_view(
        data=data,
        session=session,
        current_password=request.current_password,
        new_password=request.new_password,
        confirm_new_password=request.confirm_new_password,
    )
    return UpdatePasswordResponse(message="Пароль успешно обновлён")


@api_router.post("/login/user")
async def login(
    form: OAuth2PasswordRequestForm = Depends(), session: AsyncSession = Depends(get_db)
):
    return await log_in_user_view(form, session)
