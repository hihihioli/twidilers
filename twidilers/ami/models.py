from ..database import *
from sqlalchemy.orm import Mapped, mapped_column,relationship
from sqlalchemy import LargeBinary, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB

class Account(db.Model): #The user accounts
    __tablename__ = 'accounts'
    id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True,unique=True)
    username:Mapped[str] = mapped_column(unique=True,nullable=False)
    password:Mapped[str]
    