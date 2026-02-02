import asyncio
from app.db.database import engine
from app.db.models.base import Base


async def init_db():
    async with engine.begin() as conn:
        return await conn.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    asyncio.run(init_db())
