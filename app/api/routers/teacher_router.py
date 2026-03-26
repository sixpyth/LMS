from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.deps import get_current_user, get_db
from app.db.models.user import User
from app.services.teacher_service import download_homework_service, open_homework_list_service, upload_homework_service

api_router = APIRouter(prefix='/teacher',tags=["Teacher"])

@api_router.post("/upload-homework")
async def upload_homework(
    file: UploadFile,
    # current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    return await upload_homework_service(file=file,session=session)


@api_router.get('/download-homework')
async def download_homework(file_name: str):
    return await download_homework_service(file_name=file_name)
 

@api_router.get('/homework-list', response_description="hello")
async def open_homework_list(bucket_name):
    return await open_homework_list_service(bucket_name=bucket_name)


@api_router.delete('/delete-homework')
async def delete_homework(object_name):
    return ""