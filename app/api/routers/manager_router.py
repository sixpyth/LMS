from fastapi import APIRouter, Depends, Query
from app.db.deps import role_required, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User
from app.crud.crud import get_profiles
from app.schemas.manager_schemas import (
    AddScheduleRequest,
    AddScheduleResponse,
    AddStudentToLessonResponse,
    AddStudentToLessonRequest,
    GetStudentsRequest,
    GetStudentsResponse,
    GetTeachersRequest,
    GetTeachersResponse,
)
from app.services.manager_service import (
    add_student_to_lesson_service,
    fetch_all_schedule_service,
    delete_user_service,
)

from app.view.manager_view import (
    fetch_all_students_view,
    fetch_all_teachers_view,
    add_schedule_view,
)

from sqlalchemy.orm import selectinload
from sqlalchemy import select


api_router = APIRouter(prefix="/manager", tags=["Manager"])


@api_router.get("/manager")
async def check_role(
    session: AsyncSession = Depends(get_db),
    current_user: User = Depends(role_required(["ADMIN"])),
):
    """Check the user's role"""
    result = "ok"
    return await get_profiles(db=session)


@api_router.post("/set-schedule", response_model=AddScheduleResponse)
async def add_schedule(
    request: AddScheduleRequest, session: AsyncSession = Depends(get_db)
) -> AddScheduleResponse:
    """
    Creates a schedule at a specific time
    Schedule includes: Start time, finish time, teacher's surname
    lesson's format, lesson't type
    """
    result = await add_schedule_view(
        session=session,
        start=request.start,
        finish=request.finish,
        teacher_login=request.teacher_login,
        format=request.format,
        type=request.type,
    )
    return result


@api_router.post("/add-student-to-lesson", response_model=AddStudentToLessonResponse)
async def add_student_to_lesson(
    request: AddStudentToLessonRequest, session: AsyncSession = Depends(get_db)
) -> AddStudentToLessonResponse:
    """Add a student to a chosen lesson"""
    return await add_student_to_lesson_service(
        session=session, student=request.student_id, lesson_id=request.lesson_id
    )


@api_router.get("/get-user")
async def get_user(login, session: AsyncSession = Depends(get_db)):
    """Returns one user"""
    role = select(User).options(selectinload(User.profile)).where(User.login == login)
    result = await session.execute(role)
    user = result.scalar_one_or_none()


@api_router.get("/get-students", response_model=GetStudentsResponse)
async def get_students(
    request: GetStudentsRequest = Query(),
    session: AsyncSession = Depends(get_db),
):
    result = await fetch_all_students_view(
        limit=request.limit,
        skip=request.skip,
        profile_type=request.profile_type,
        session=session,
    )
    return result


@api_router.get("/get-teachers", response_model=GetTeachersResponse)
async def get_teachers(
    request: GetTeachersRequest = Query(),
    session: AsyncSession = Depends(get_db),
):
    result = await fetch_all_teachers_view(
        limit=request.limit,
        skip=request.skip,
        profile_type=request.profile_type,
        session=session,
    )
    return result


@api_router.get("/get-schedule")
async def get_schedule(session: AsyncSession = Depends(get_db)):
    return await fetch_all_schedule_service(skip=0, limit=5, session=session)


@api_router.post("/delete-user")
async def delete_user(login: str, session: AsyncSession = Depends(get_db)):
    return await delete_user_service(login=login, session=session)
