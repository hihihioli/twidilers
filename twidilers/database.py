"""
Initialize the database.
"""

#imports for making the database
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

from flask_bcrypt import Bcrypt #Install bcrypt for hashing passwords

class Base(DeclarativeBase): #the base class(https://docs.sqlalchemy.org/en/20/orm/mapping_api.html#sqlalchemy.orm.DeclarativeBase)
  pass

db = SQLAlchemy(model_class=Base) #Create the db object
bcrypt = Bcrypt() #Create a bcrypt object for hashing the passwords.

from . import models #Import the models before initializing the database

