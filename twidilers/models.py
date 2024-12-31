"""
This is where all of the database models are created.
"""

from .objects import db, bcrypt #our db objects

#The model imports and data types
from sqlalchemy.orm import Mapped, mapped_column,relationship
from sqlalchemy import LargeBinary, DateTime, ForeignKey,Column, Table,Integer
from sqlalchemy.dialects.postgresql import JSONB

import datetime #For the time

#Many-to-Many relationship table for followers
follow = Table(
    'follow',
    db.metadata,
    Column('following_id', Integer, ForeignKey('accounts.id'),primary_key=True),
    Column('follower_id', Integer, ForeignKey('accounts.id'),primary_key=True)
)


class Account(db.Model): #The user accounts
  __tablename__ = 'accounts'
  id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True,unique=True)
  username:Mapped[str] = mapped_column(unique=True,nullable=False)
  displayname:Mapped[str] = mapped_column(nullable=False)
  posts:Mapped[list["Post"]] = relationship(back_populates="author",cascade="all, delete, delete-orphan")
  photo:Mapped[bytes] = mapped_column(LargeBinary,nullable=True)
  password_hash:Mapped[bytes] = mapped_column(LargeBinary,nullable=False) #Store the password hash instead of plaintext
  userdata:Mapped[dict] = mapped_column(JSONB,default={
      "joined": datetime.datetime.now(datetime.timezone.utc).timestamp(), #The time the account was created
      "bio": 'No bio yet', 
    })  
  #Making the table self-referential (it relates to other objects of the same class)
  followers = relationship('Account', 
    secondary = follow, #The association table the relationship is based on (above)
    primaryjoin = (follow.c.following_id == id), #Connects the rows which have the following_id the same as the user id (getting the users that you are following)
    secondaryjoin = (follow.c.follower_id == id), #Connects the rows which have the follower_id the same as the user id (getting the users that follow you)
    backref = 'following' #something
    )
  
  
  @property
  def password(self):
    raise AttributeError("Password cannot be retrieved.") #Prevent trying to directly access the password.
  
  @password.setter
  def password(self,plain_password): #This will be called when setting the password
    self.password_hash = bcrypt.generate_password_hash(plain_password) #hash the password then store it in a binary object

  def check_password(self,plain_password): #Returns a bool on whether the passwords match
    return bcrypt.check_password_hash(self.password_hash, plain_password) #Check them
  
  def __repr__(self): #When printing, what to return
    return f'username={self.username},id={self.id}'
  
class Post(db.Model): #The posts(linked to accounts)
  __tablename__ = 'posts'
  id:Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
  author_id:Mapped[int] = mapped_column(ForeignKey("accounts.id",ondelete='CASCADE'))
  author:Mapped["Account"] = relationship(back_populates="posts")
  title:Mapped[str]
  content:Mapped[str]
  decorators:Mapped[str] = mapped_column(default='')
  date: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc),nullable=True) #an aware datetime object
  def __repr__(self):
    return f"id={self.id},title={self.title},author={self.author}"
