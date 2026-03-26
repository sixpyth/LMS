from pydantic import BaseModel, UUID4, Field
from enums.lesson import LessonType, Format
from enums.profile_type import ProfileType
from enums.week_days import WeekDays
from datetime import time, date


class AddScheduleResponse(BaseModel):
    message: str


class AddScheduleRequest(BaseModel):
    start_time: time
    finish_time: time
    teacher_login: str
    days: list[int]
    format: Format
    type: LessonType
    color: str = None
    start_date: date 
    finish_date: date


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
