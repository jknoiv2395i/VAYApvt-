import asyncio
from app.core.database import engine
from sqlalchemy import text

async def check_tables():
    async with engine.connect() as conn:
        try:
            result = await conn.execute(text("SELECT * FROM authorization_applications LIMIT 1;"))
            print("Table 'authorization_applications' exists.")
        except Exception as e:
            print(f"Error accessing table: {e}")

if __name__ == "__main__":
    asyncio.run(check_tables())
