"""
SHAPE UP — FastAPI Backend Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from core.config import settings
from db.database import init_db

# Import all routers
from api.auth import router as auth_router
from api.trainers import router as trainers_router
from api.owner import router as owner_router
from api.packages import router as packages_router
from api.hours import router as hours_router
from api.reviews import router as reviews_router
from api.gallery import router as gallery_router
from api.branches import router as branches_router
from api.logo import router as logo_router
from api.upload import router as upload_router
from api.videos import router as videos_router
from api.programs import router as programs_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: initialize database and seed data."""
    await init_db()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="SHAPE UP Fitness Studio — Backend API",
    lifespan=lifespan,
)

# CORS
if settings.CORS_ALLOW_ALL:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Static file serving for uploads - REMOVED (Using Cloudinary only)
# app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Register routers under /api prefix
app.include_router(auth_router, prefix="/api")
app.include_router(trainers_router, prefix="/api")
app.include_router(owner_router, prefix="/api")
app.include_router(packages_router, prefix="/api")
app.include_router(hours_router, prefix="/api")
app.include_router(reviews_router, prefix="/api")
app.include_router(gallery_router, prefix="/api")
app.include_router(branches_router, prefix="/api")
app.include_router(logo_router, prefix="/api")
app.include_router(upload_router, prefix="/api")
app.include_router(videos_router, prefix="/api")
app.include_router(programs_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "SHAPE UP API is running", "docs": "/docs"}


@app.get("/api/health")
async def health():
    return {"status": "healthy"}
