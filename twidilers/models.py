from .database import db, Mapped, mapped_column,relationship,desc

class Account(db.Model):
  __tablename__ = 'accounts'
  id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
  username:Mapped[str] = mapped_column(unique=True,nullable=False)
  password:Mapped[str] = mapped_column(nullable=False)
  def __repr__(self):
    return f'username={self.username},password={self.password},id={self.id}'
  
class Post(db.Model):
  __tablename = 'posts'
  id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
  title:Mapped[str]
  content:Mapped[str]
  author:Mapped[str] = mapped_column(default='')
  date:Mapped[str]
  decorators:Mapped[str] = mapped_column(default='')
  def __repr__(self):
    return f"id={self.id},title={self.title},author={self.author}"
