from app.services.profile_service import activate_user_profile_service
from app.errors.user_errors import EmailAlreadyExists
from fastapi import HTTPException
from starlette import status


async def activate_user_profile_view(session, password, email, login):
    try:
        return await activate_user_profile_service(
            session=session, password=password, email=email, login=login
        )
    except EmailAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email already exists"
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service is not available. Please, try again letter",
        )
