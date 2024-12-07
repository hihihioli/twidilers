from .database import db, bcrypt

from sqlalchemy.orm import Mapped, mapped_column,relationship
from sqlalchemy import desc, LargeBinary, DateTime
import datetime

class Account(db.Model):
  __tablename__ = 'accounts'
  id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True,unique=True)
  username:Mapped[str] = mapped_column(unique=True,nullable=False)
  password_hash:Mapped[bytes] = mapped_column(LargeBinary,nullable=False) #Store the password hash instead of plaintext
  
  @property
  def password(self):
    raise AttributeError("Password cannot be retrieved.") #Prevent trying to directly access the password.
  
  @password.setter
  def password(self,plain_password): #This will be called when setting the password
    self.password_hash = bcrypt.generate_password_hash(plain_password) #hash the password then store it in a binary object

  def check_password(self,plain_password): #Returns a bool on whether the passwords match
    return bcrypt.check_password_hash(self.password_hash, plain_password) #Check them
  
  def __repr__(self): #When printing, what to return
    return f'username={self.username},password={self.password},id={self.id}'
  
class Post(db.Model):
  id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
  title:Mapped[str]
  content:Mapped[str]
  author:Mapped[str] = mapped_column(default='')
  decorators:Mapped[str] = mapped_column(default='')
  date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc),nullable=True) #an aware datetime object
  def __repr__(self):
    return f"id={self.id},title={self.title},author={self.author}"
