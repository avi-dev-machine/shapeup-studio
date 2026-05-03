"""
Async database engine, session management, and initialization.
"""
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool
from typing import AsyncGenerator

from core.config import settings

# Handle Database URL
db_url = settings.DATABASE_URL

# Robust URL handling for PostgreSQL (Render/Heroku often use postgres://)
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://") and "+asyncpg" not in db_url:
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Function to force anonymous prepared statements (required for PgBouncer in transaction mode)
def _prepare_statement_name(name):
    return None

# Configure engine arguments
connect_args = {}
if "sqlite" in db_url:
    connect_args["check_same_thread"] = False
else:
    # Essential for PgBouncer / Render / Supabase
    connect_args["statement_cache_size"] = 0
    connect_args["prepared_statement_name_func"] = _prepare_statement_name

# Async engine
engine = create_async_engine(
    db_url,
    echo=settings.DEBUG,
    connect_args=connect_args,
    pool_pre_ping=True,
    poolclass=NullPool,
)

# Async session factory
async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


# Declarative base for all models
class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency: yields a database session per request."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    """Create all tables and seed initial data."""
    print("Initializing database...")
    from models import admin, trainer, owner, package, hours, review, gallery, branch, logo, video  # noqa
    from core.security import hash_password

    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise

    # Seed admin user if not exists
    try:
        async with async_session_factory() as session:
            from sqlalchemy import select
            from models.admin import Admin

            result = await session.execute(
                select(Admin).where(Admin.email == settings.ADMIN_EMAIL)
            )
            existing = result.scalar_one_or_none()

            if not existing:
                admin_user = Admin(
                    email=settings.ADMIN_EMAIL,
                    hashed_password=hash_password(settings.ADMIN_PASSWORD),
                )
                session.add(admin_user)
                print("Admin user seeded.")

            # Seed owner if not exists
            from models.owner import Owner

            result = await session.execute(select(Owner))
            existing_owner = result.scalar_one_or_none()

            if not existing_owner:
                owner_record = Owner(
                    name="Debashish Dutta",
                    photo_url="",
                    description="The visionary behind SHAPE UP, Debashish Dutta has been transforming lives through fitness for over 25 years. His passion for health and wellness has built a community of 1500+ active members across 4 branches in Kolkata.",
                )
                session.add(owner_record)
                print("Owner seeded.")

            # Seed branches if not exists
            from models.branch import Branch

            result = await session.execute(select(Branch))
            existing_branches = result.scalars().all()

            if not existing_branches:
                branches = [
                    Branch(name="KASBA", address="Rajkrishna Chatterjee Rd, Bosepukur", maps_url="https://maps.google.com/?q=Rajkrishna+Chatterjee+Rd+Bosepukur+Kolkata"),
                    Branch(name="TRIBORNO", address="Near Triborno Club, Sarat Park", maps_url="https://maps.google.com/?q=Triborno+Club+Sarat+Park+Kolkata"),
                    Branch(name="BALLYGUNGE", address="Near South Point High School", maps_url="https://maps.google.com/?q=South+Point+High+School+Ballygunge+Kolkata"),
                    Branch(name="NANDIBAGAN", address="Neli Nagar, Haltu", maps_url="https://maps.google.com/?q=Neli+Nagar+Haltu+Kolkata"),
                ]
                session.add_all(branches)
                print("Branches seeded.")

            # Seed gym hours
            from models.hours import GymHours, AdmissionCharge

            result = await session.execute(select(GymHours))
            existing_hours = result.scalars().all()

            if not existing_hours:
                hours_data = [
                    GymHours(slot_name="Morning", time_range="6:30 AM – 12:00 PM", is_highlighted=False),
                    GymHours(slot_name="Afternoon (Ladies Only)", time_range="3:30 PM – 5:00 PM", is_highlighted=True),
                    GymHours(slot_name="Evening", time_range="5:00 PM – 11:00 PM", is_highlighted=False),
                    GymHours(slot_name="Closure", time_range="Sunday Evenings and Monday Mornings", is_highlighted=False),
                ]
                session.add_all(hours_data)
                print("Hours seeded.")

            # Seed admission charges
            result = await session.execute(select(AdmissionCharge))
            existing_charges = result.scalars().all()

            if not existing_charges:
                charges = [
                    AdmissionCharge(description="Single Person", amount=600),
                    AdmissionCharge(description="Group of 2 (per person)", amount=500),
                    AdmissionCharge(description="Group of 3+ (per person, must join together)", amount=400),
                ]
                session.add_all(charges)
                print("Admission charges seeded.")

            # Seed packages
            from models.package import Package

            result = await session.execute(select(Package))
            existing_packages = result.scalars().all()

            if not existing_packages:
                packages = [
                    # Gym Membership
                    Package(category="gym", title="1 Month", price=899, duration="1 Month", notes="", display_order=1),
                    Package(category="gym", title="3 Months", price=2399, duration="3 Months", notes="", display_order=2),
                    Package(category="gym", title="6 Months", price=4199, duration="6 Months", notes="Includes ₹300 admission fee", display_order=3),
                    Package(category="gym", title="12 Months", price=7799, duration="12 Months", notes="No admission charges", display_order=4),
                    Package(category="gym", title="24 Months", price=11999, duration="24 Months", notes="No admission charges", display_order=5),
                    # Personal Training
                    Package(category="pt", title="Single Class", price=250, duration="Per Class", notes="Head Trainer: ₹300", display_order=1),
                    Package(category="pt", title="1 Month (12 classes)", price=2499, duration="1 Month", notes="Head Trainer: ₹3,000", display_order=2),
                    Package(category="pt", title="3 Months (36 classes)", price=2299, duration="3 Months", notes="Per month", display_order=3),
                    Package(category="pt", title="6 Months (72 classes)", price=2199, duration="6 Months", notes="Per month", display_order=4),
                    Package(category="pt", title="12 Months (144 classes)", price=1999, duration="12 Months", notes="Per month", display_order=5),
                    # Group PT
                    Package(category="group_pt", title="Group of 2", price=4399, duration="12 Classes", notes="", display_order=1),
                    Package(category="group_pt", title="Group of 3", price=5999, duration="12 Classes", notes="", display_order=2),
                    # Weight Loss
                    Package(category="weight_loss", title="Special Weight Loss", price=2999, duration="12 Classes", notes="Valid for 1 month", display_order=1),
                    # Add-Ons
                    Package(category="addon", title="Locker", price=300, duration="", notes="", display_order=1),
                    Package(category="addon", title="Massage (45-60 min)", price=600, duration="Per Session", notes="", display_order=2),
                    Package(category="addon", title="Steam Bath (15-20 min)", price=250, duration="Per Session", notes="", display_order=3),
                    Package(category="addon", title="Per Day Session", price=200, duration="Per Day", notes="", display_order=4),
                ]
                session.add_all(packages)
                print("Packages seeded.")

            # Seed logo
            from models.logo import SiteLogo

            result = await session.execute(select(SiteLogo))
            existing_logo = result.scalar_one_or_none()

            if not existing_logo:
                logo = SiteLogo(logo_url="")
                session.add(logo)
                print("Logo seeded.")

            # Seed Special Programs
            from models.program import SpecialProgram

            result = await session.execute(select(SpecialProgram))
            existing_programs = result.scalars().all()

            if not existing_programs:
                programs = [
                    SpecialProgram(name="Stretching exercise special training", display_order=1),
                    SpecialProgram(name="Massage", display_order=2),
                    SpecialProgram(name="Kickboxing", display_order=3),
                    SpecialProgram(name="Yoga", display_order=4),
                    SpecialProgram(name="Medicine", display_order=5),
                    SpecialProgram(name="Physiotherapy", display_order=6),
                    SpecialProgram(name="Supplement", display_order=7),
                    SpecialProgram(name="Weight loss", display_order=8),
                    SpecialProgram(name="Weight gain", display_order=9),
                ]
                session.add_all(programs)
                print("Programs seeded.")

            await session.commit()
            print("Database initialization complete.")
    except Exception as e:
        print(f"Error during database seeding: {e}")
        raise
