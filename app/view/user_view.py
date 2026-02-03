from logger import logger
from app.services.user_service import (
    create_user_service,
    create_teacher_service,
    log_in_user_service,
)

from app.schemas.user_schemas import UserLoginResponse, UserIn
from app.errors.user_errors import (
    UserAlreadyExists,
    PhoneNumberExists,
    WrongInfoInput,
    UserNotFound,
    WrongCredentials,
    NoPasswordFound,
)

from starlette.responses import JSONResponse
from fastapi import HTTPException
from starlette import status
from sqlalchemy.ext.asyncio import AsyncSession


async def create_user_view(session: AsyncSession, data):
    try:
        return await create_user_service(session=session, data=data)

    except PhoneNumberExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Номер уже добавлен"
        )

    except UserAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Пользователь уже существует"
        )

    except WrongInfoInput as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, content={"errors": e.errors}
        )


async def create_teacher_view(session: AsyncSession, data):
    try:
        return await create_teacher_service(session=session, data=data)

    except PhoneNumberExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Номер уже добавлен"
        )

    except UserAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Пользователь уже существует"
        )

    except WrongInfoInput as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, content={"errors": e.errors}
        )


async def log_in_user_view(data, session: AsyncSession) -> UserLoginResponse:
    try:
        user, token = await log_in_user_service(data=data, session=session)
        user_in = UserIn.from_orm(user)
        return UserLoginResponse(access_token=token, token_type="bearer", user=user_in)
    except UserNotFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
        )
    except WrongCredentials:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный логин или пароль"
        )
    except NoPasswordFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="В данный момент вы еще не создали свой пароль. Пожалуйста, создайте свой уникальный пароль",
        )
    except Exception as e:
        logger.error("Message", e)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Неизвестная ошибка, пожалуйста, попробуйте позже",
        )
