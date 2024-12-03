from .database import db,Mapped, mapped_column,relationship

class Account(db.Model):
  __tablename__ = 'accounts'
  id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
  username:Mapped[str] = mapped_column(unique=True)
  password:Mapped[str]