"""Gym hours and admission charges models."""
from sqlalchemy import Column, Integer, String, Boolean
from db.database import Base


class GymHours(Base):
    __tablename__ = "gym_hours"

    id = Column(Integer, primary_key=True, autoincrement=True)
    slot_name = Column(String(255), nullable=False)
    time_range = Column(String(255), nullable=False)
    is_highlighted = Column(Boolean, default=False)


class AdmissionCharge(Base):
    __tablename__ = "admission_charges"

    id = Column(Integer, primary_key=True, autoincrement=True)
    description = Column(String(255), nullable=False)
    amount = Column(Integer, nullable=False)
