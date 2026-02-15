from fastapi import APIRouter, Depends, UploadFile
from app.db.deps import get_current_user, get_db
from app.services.profile_service import set_profile_avatar_serivce
from app.db.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user_schemas import (
    ProfileActivateResponse,
    ProfileActivateResquest,

)
from app.view.profile_view import activate_profile_view
from app.services.profile_service import fetch_schedule_service

api_router = APIRouter(prefix="/profile", tags=["Profile"])


@api_router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "name": current_user.profile.name,
        "surname": current_user.profile.surname,
        "email": current_user.email,
        "avatar_url": current_user.profile.avatar_url,
    }


@api_router.post("/set-profile-picture")
async def set_profile_picture(
    file: UploadFile,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    return await set_profile_avatar_serivce(
        file=file, session=session, current_user=current_user
    )


@api_router.post("/{user}/activate", response_model=ProfileActivateResponse)
async def activate_profile(
    request: ProfileActivateResquest, session: AsyncSession = Depends(get_db)
) -> ProfileActivateResponse:
    return await activate_profile_view(
        session=session,
        password=request.password,
        email=request.email,
        login=request.login,
    )

@api_router.get("/fetch-schedule")
async def fetch_schedule(current_user: User = Depends(get_current_user), session: AsyncSession=Depends(get_db)):
    return await fetch_schedule_service(current_user=current_user, session=session)