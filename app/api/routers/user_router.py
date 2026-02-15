from app.view.user_view import (
    create_student_view,
    log_in_user_view,
    create_teacher_view,
    update_user_password_view,
)
from fastapi import APIRouter, Depends
from app.db.deps import get_db, get_current_user
from app.db.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user_schemas import (
    ProfileCreateRequest,
    ProfileCreateResponse,
    ProfileCreateErrors,
    UpdatePasswordRequest,
    UpdatePasswordResponse,
)
from fastapi.security import OAuth2PasswordRequestForm


api_router = APIRouter(prefix="/users", tags=["User"])


@api_router.post("/{user}/create", response_model=ProfileCreateResponse)
async def create_student(
    request: ProfileCreateRequest, session: AsyncSession = Depends(get_db)
) -> ProfileCreateResponse:
    result = await create_student_view(session=session, data=request)
    return result


@api_router.post(
    "/{user}/teacher-create", response_model=ProfileCreateResponse | ProfileCreateErrors
)
async def create_teacher(
    request: ProfileCreateRequest, session: AsyncSession = Depends(get_db)
) -> ProfileCreateResponse | ProfileCreateErrors:
    result = await create_teacher_view(session=session, data=request)
    return result


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
    result = await update_user_password_view(
        data=data,
        session=session,
        current_password=request.current_password,
        new_password=request.new_password,
        confirm_password=request.confirm_password,
    )
    return result


@api_router.post("/login/user")
async def login(
    form: OAuth2PasswordRequestForm = Depends(), session: AsyncSession = Depends(get_db)
):
    return await log_in_user_view(form, session)
