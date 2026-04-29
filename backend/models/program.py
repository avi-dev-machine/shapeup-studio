from sqlalchemy import Column, Integer, String
from db.database import Base

class SpecialProgram(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    display_order = Column(Integer, default=0)
