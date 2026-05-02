import asyncio
import os
import sys

# Add the current directory to sys.path so we can import from core and db
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from core.config import settings
from db.database import async_session_factory
from models.trainer import Trainer
from models.owner import Owner
from sqlalchemy import select

async def check_links():
    print(f"Connecting to: {settings.DATABASE_URL.split('@')[-1]}")
    async with async_session_factory() as session:
        # Check Owner
        print("\n--- OWNER ---")
        result = await session.execute(select(Owner))
        owner = result.scalar_one_or_none()
        if owner:
            print(f"Owner: {owner.name}")
            print(f"Photo URL: {owner.photo_url}")
            if not owner.photo_url.startswith('http'):
                print(">> [OLD LINK DETECTED]")
        else:
            print("No owner found.")

        # Check Trainers
        print("\n--- TRAINERS ---")
        result = await session.execute(select(Trainer))
        trainers = result.scalars().all()
        if trainers:
            for t in trainers:
                status = "OK" if t.photo_url.startswith('http') else ">> [OLD LINK]"
                print(f"ID: {t.id} | Name: {t.name} | Photo: {t.photo_url} {status}")
        else:
            print("No trainers found.")

if __name__ == "__main__":
    asyncio.run(check_links())
