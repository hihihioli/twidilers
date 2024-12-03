from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column,relationship
from sqlalchemy.dialects.postgresql import JSONB
'''
class Base(DeclarativeBase):
  pass

db = SQLAlchemy(model_class=Base)

class Account(db.Model):
  __tablename__ = 'accounts'
  id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
  username:Mapped[str] = mapped_column(unique=True)
  password:Mapped[str]
  '''