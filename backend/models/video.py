from sqlalchemy import Column, Integer, String
from db.database import Base

class WorkoutVideo(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    video_url = Column(String(1000), nullable=False)
    display_order = Column(Integer, default=0)
