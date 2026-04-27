"""Site logo model — singleton record."""
from sqlalchemy import Column, Integer, String
from db.database import Base


class SiteLogo(Base):
    __tablename__ = "site_logo"

    id = Column(Integer, primary_key=True, autoincrement=True)
    logo_url = Column(String(500), default="")
