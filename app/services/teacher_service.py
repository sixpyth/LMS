from datetime import timedelta

from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from minio import Minio
from fastapi import UploadFile
from app.core.minio.client import client



async def upload_homework_service(file: UploadFile, session: AsyncSession):
    client.put_object(
        "homeworks",
        file.filename,
        file.file,
        length=-1,
        part_size=10*1024*1024
    )

async def download_homework_service(file_name:str):
    url = client.presigned_get_object(
        "homeworks",
        file_name,
        expires=timedelta(minutes=10)
    )
    
    return StreamingResponse(
        file_name,
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f"attachment; filename={file_name}"
        }
    )

async def open_homework_list_service(bucket_name):

    objects = client.list_objects(bucket_name)

    for obj in objects:
        return obj.object_name
    


