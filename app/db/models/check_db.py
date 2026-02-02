import asyncio
from sqlalchemy import text
from app.db.database import engine


async def check():
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT 1"))
        print(result.scalar())


if __name__ == "__main__":
    asyncio.run(check())
