from pydantic import BaseModel, EmailStr, Field
from typing import Union


class ProfileCreateRequest(BaseModel):
    phone: str
    name: str
    surname: str


class ProfileCreateErrors(BaseModel):
    error: list[Union[dict, str]]


class ProfileCreateResponse(BaseModel):
    message: str


class UserCreateRequest(BaseModel):
    email: EmailStr = Field(
        "example@gmail.com", pattern=r"^[\w\.-]+@[\w\.-]+\.\w{2,4}$"
    )
    password: str
    login: str


class UserCreateResponse(BaseModel):
    message: object | None


class UserLoginRequest(BaseModel):
    username: str
    password: str


class UserIn(BaseModel):
    name: str
    surname: str
    avatar_url: str | None = None
    profile_type: str

    class Config:
        from_attributes = True


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserIn


class UpdatePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_new_password: str


class UpdatePasswordResponse(BaseModel):
    message: str
