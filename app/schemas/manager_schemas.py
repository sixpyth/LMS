from pydantic import BaseModel, UUID4, Field
from enums.lesson import LessonType, Format
from datetime import datetime
from enums.profile_type import ProfileType


class AddScheduleResponse(BaseModel):
    message: str


class AddScheduleRequest(BaseModel):
    start: datetime
    finish: datetime
    teacher_login: str
    format: Format
    type: LessonType
    color: str


class AddStudentToLessonResponse(BaseModel):
    message: str


class AddStudentToLessonRequest(BaseModel):
    login: str
    lesson_id: UUID4


class GetStudentsRequest(BaseModel):
    limit: int | None = Field(5, gt=0, le=100)
    skip: int | None = Field(0, ge=0)
    profile_type: ProfileType = ProfileType.STUDENT


class GetStudentsResponse(BaseModel):
    count: int
    profiles: list


class GetTeachersRequest(BaseModel):
    limit: int | None = Field(5, gt=0, le=100)
    skip: int | None = Field(0, ge=0)
    profile_type: ProfileType = ProfileType.TEACHER


class GetTeachersResponse(BaseModel):
    count: int
    profiles: list
