"""
This is where all of the database models are created.
"""

from .objects import db, bcrypt #our db objects

#The model imports and data types
from sqlalchemy.orm import Mapped, mapped_column,relationship
from sqlalchemy import LargeBinary, DateTime, ForeignKey,Column, Table,Integer
from sqlalchemy.dialects.postgresql import JSONB

import datetime #For the time
import random #To generate codes

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
  username:Mapped[str] = mapped_column(unique=True,nullable=True)
  displayname:Mapped[str] = mapped_column(nullable=True)
  email:Mapped[str] = mapped_column(nullable=False)
  isMod:Mapped[bool] = mapped_column(default=False) #If they are a moderator
  posts:Mapped[list["Post"]] = relationship(back_populates="author",cascade="all, delete, delete-orphan")
  photo:Mapped[bytes] = mapped_column(LargeBinary,nullable=True)
  password_hash:Mapped[bytes] = mapped_column(LargeBinary,nullable=True) #Store the password hash instead of plaintext
  notifications:Mapped[list] = mapped_column(JSONB, default=list)
  verified:Mapped[bool] = mapped_column(default=False) #Wether they are verified or not
  verification_code:Mapped[int] = mapped_column(nullable=True,default=random.randint(100000,999999)) #Their code to verify, if false
  setup:Mapped[bool] = mapped_column(default=False) #If they have set up their account
  is_oauth:Mapped[bool] = mapped_column(default=False) #If they are an oauth user
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
  
  def verify(self,code): #Function to verify a user
    try:
      code = int(code)
    except:
      return False
    if code == self.verification_code: #If right code,
      self.verified = True             #mark user as verified,
      self.verification_code = None    #delete the code, and
      return True                      #return true to mark as complete.
    return False #Return false if incorrect code
  
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
