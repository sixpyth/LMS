from logger import logger
from app.services.user_service import (
    create_student_service,
    create_teacher_service,
    log_in_user_service,
    update_user_password_service,
)

from app.schemas.user_schemas import UserLoginResponse, UserIn, UserCreateResponse
from app.errors.user_errors import (
    UserAlreadyExists,
    PhoneNumberExists,
    WrongInfoInput,
    UserNotFound,
    WrongCredentials,
)
from app.errors.password_errors import (
    NoPasswordFound,
    PasswordsNotMatch,
    PasswordAlreadyExists,
    WrongPasswordInput,
)

from starlette.responses import JSONResponse
from fastapi import HTTPException
from starlette import status
from sqlalchemy.ext.asyncio import AsyncSession


async def create_student_view(session: AsyncSession, data):
    try:
        result = await create_student_service(session=session, data=data)
        return UserCreateResponse(
            message=result
        )

    except PhoneNumberExists:

        logger.error(
            msg=f"User {data.surname} with {data.phone} wasn't created due to this number already exists"
        )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Номер уже добавлен"
        )

    except UserAlreadyExists:

        logger.error(
            msg=f"User {data.surname} {data.name} wasn't created due to this user already exists"
        )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Пользователь уже существует"
        )

    except WrongInfoInput as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, content={"errors": e.errors}
        )


async def create_teacher_view(session: AsyncSession, data):
    try:

        await create_teacher_service(session=session, data=data)
        return UserCreateResponse(
            message=f"Учитель {data.surname} {data.name} был успешно добавлен!"
        )

    except PhoneNumberExists:
        logger.error(
            msg=f"User {data.surname} with {data.phone} wasn't created due to this number already exists"
        )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Номер уже добавлен"
        )

    except UserAlreadyExists:
        logger.error(
            msg=f"User {data.surname} {data.name} wasn't created due to this user already exists"
        )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Пользователь уже существует"
        )

    except WrongInfoInput as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, content={"errors": e.errors}
        )

    except Exception as error:
        logger.error(error)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Неизвестная ошибка, пожалуйста, попробуйте позже")

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
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный логин или пароль"
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


async def update_user_password_view(
    data, session, current_password: str, new_password: str, confirm_password: str
):
    try:
        return await update_user_password_service(
            data=data,
            session=session,
            current_password=current_password,
            new_password=new_password,
            confirm_password=confirm_password,
        )
    except WrongCredentials as errors:
        logger.error(msg=errors)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный текущий пароль"
        )
    except PasswordsNotMatch as errors:
        logger.error(msg=errors)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Пароли не совпадают"
        )
    except PasswordAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Новый пароль не может совпадать со старым",
        )
    except WrongPasswordInput as errors:
        logger.error(msg=errors)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=errors.errors
        )
    
    except Exception as errors:
        logger.error(msg=errors)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Неизвестная ошибка, пожалуйста, попробуйте позже",
        )
