"""
Initialize the database.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc, LargeBinary
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column,relationship
from sqlalchemy.dialects.postgresql import JSONB

from flask_bcrypt import Bcrypt #Install bcrypt for hashing passwords

class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)
bcrypt = Bcrypt() #Create a bcrypt object for hashing the passwords.

from . import models #Import the models before initializing the database

