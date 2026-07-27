from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user import User
from app.core.config import MONGO_URI

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.models.user import User
from app.core.config import MONGO_URI

async def init_db():
    try:
        client = AsyncIOMotorClient(MONGO_URI)

        # Test the connection
        await client.server_info()  

        print(" DATABASE CONNECTED SUCCESSFULLY ")

        db_name = MONGO_URI.split("/")[-1].split("?")[0]
        db = client[db_name]

        await init_beanie(
            database=db,
            document_models=[User]
        )
    except Exception as e:
        print("DATABASE CONNECTION FAILED ")
        print("Error:", e)
        raise e
