"""
Initialize the database.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column,relationship
from sqlalchemy.dialects.postgresql import JSONB

class Base(DeclarativeBase):
  pass

from . import models 
db = SQLAlchemy(model_class=Base)
