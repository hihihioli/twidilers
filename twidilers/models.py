from .database import db

class Account(db.Model):
  __tablename__ = 'accounts'