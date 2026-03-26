from app.errors.password_errors import WrongPasswordValidation
from app.validators.personal_info_validator import is_cyrillic
import string

letters = string.ascii_letters


async def password_validator(password: str) -> bool:
    errors: list[dict] = []

    if len(password) < 8:
        errors.append(
            {
                "field": "password",
                "detail": "Длина пароля меньше 8 символов",
                "invalid_values": [],
            }
        )

    if not any(letter in password for letter in letters):
        errors.append(
            {
                "field": "password",
                "detail": "Пароль должен содержать как минимум одну букву",
                "invalid_values": [],
            }
        )

    if await is_cyrillic(name=password, surname=password) is True:
        errors.append(
            {
                "field:":"password",
                "detail": "Пароль не должен содержать кириллицу",
                "invalid_values": []
            }
            
        )

    if errors:
        raise WrongPasswordValidation(errors=errors)

    return True
