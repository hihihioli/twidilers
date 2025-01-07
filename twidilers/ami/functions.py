from .models import Musics as Account,db
from flask import session,flash

def save():
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f'An error occured: {e}')
        
def findAccount(username=None): #Finds an account that matches a given username that defaults to the session username
    if username is None:
        username = session.get('username')
    account = db.session.execute(db.select(Account).filter_by(username=username)).scalar()
    return account

def deleteAccount(username=None):
    if username is None:
        username = session.get('username')
    account = findAccount(username)
    db.session.delete(account)
    db.session.commit()
    flash('Successfully Deleted Account','success')