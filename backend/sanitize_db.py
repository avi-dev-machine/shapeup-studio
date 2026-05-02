import asyncio
import os
import sys

# Add the current directory to sys.path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from core.config import settings
from db.database import async_session_factory
from models.trainer import Trainer
from models.owner import Owner
from sqlalchemy import select, update

async def sanitize_db():
    print("Sanitizing Database: Removing dead local links...")
    async with async_session_factory() as session:
        # Sanitize Owner
        print("Checking Owner...")
        result = await session.execute(select(Owner))
        owner = result.scalar_one_or_none()
        if owner and owner.photo_url and not owner.photo_url.startswith('http'):
            print(f"Clearing dead link for Owner: {owner.photo_url}")
            owner.photo_url = ""
        
        # Sanitize Trainers
        print("Checking Trainers...")
        result = await session.execute(select(Trainer))
        trainers = result.scalars().all()
        for t in trainers:
            if t.photo_url and not t.photo_url.startswith('http'):
                print(f"Clearing dead link for Trainer {t.name}: {t.photo_url}")
                t.photo_url = ""

        await session.commit()
        print("Database Sanitization Complete!")

if __name__ == "__main__":
    asyncio.run(sanitize_db())
