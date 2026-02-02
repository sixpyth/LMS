from fastapi import APIRouter

api_router = APIRouter(prefix="/health")


@api_router.get("/")
def health_check():
    return "ok"
