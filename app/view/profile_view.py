from app.errors.user_errors import EmailAlreadyExists
from fastapi import HTTPException
from starlette import status
from starlette.responses import JSONResponse
from app.errors.password_errors import WrongPasswordInput
from app.errors.user_errors import (
    UserNotFound,
    UserAlreadyActive
)
from logger import logger
from app.services.profile_service import activate_profile_service
from app.schemas.user_schemas import ProfileActivateResponse

async def activate_profile_view(session, password, email, login):
    try:
        await activate_profile_service(
            session=session, password=password, email=email, login=login
        )
        return ProfileActivateResponse(message="Письмо было отправлено на почту")
    except EmailAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Почта уже существует"
        )

    except WrongPasswordInput as error:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, content={"errors": error.errors}
        )

    except UserNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь с таким логином не найден",
        )
    
    except UserAlreadyActive:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Профиль уже активирован"
        )

    except Exception as error:
        logger.error(error)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Ошибка с сервером. Пожалуйста, повторите попытку позже",
        )
