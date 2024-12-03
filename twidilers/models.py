from .database import db, Mapped, mapped_column,relationship

class Account(db.Model):
  __tablename__ = 'accounts'
  id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
  username:Mapped[str] = mapped_column(unique=True)
  password:Mapped[str]
  def __repr__(self):
    return f'username={self.username},password={self.password},id={self.id}'