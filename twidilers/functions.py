from .models import Account,db
from flask import session
import re #for regular expressions

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

def checkUsername(input):
    # Define the pattern for allowed characters
    pattern = r'^[a-zA-Z0-9_]+$'
    
    # Use re.match to check if the input matches the pattern
    if re.match(pattern, input):
        return True
    else:
        return False