from app.errors.password_errors import WrongPasswordValidation
import string

letters = string.ascii_letters


def password_validator(password: str) -> bool:
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

    if errors:
        raise WrongPasswordValidation(errors=errors)

    return True
