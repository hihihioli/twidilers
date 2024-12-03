from .models import *

def save():
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f'An error occured: {e}')