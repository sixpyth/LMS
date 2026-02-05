from datetime import datetime, timedelta
import secrets


def login_generator(name: str, surname: str) -> str:
    if not name or not surname:
        raise ValueError("Name and Surname have to be provided")
    login = f"{name.strip()[0]}.{surname.strip()}".lower()
    return login


def generate_token():
    token = secrets.token_urlsafe(32)
    return token


# User token expiration
now = datetime.now().replace(microsecond=0)
expires_at = now + timedelta(hours=24)
