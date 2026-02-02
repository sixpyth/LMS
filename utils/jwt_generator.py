from datetime import datetime, timedelta
from app.core.constants.constants import (
    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
import jwt

SECRET_KEY = "supersecretkey"



def generate_jwt_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

