from .models import Account,db
from flask import session,flash
import re #for regular expressions
from io import BytesIO
from PIL import Image, ImageOps, UnidentifiedImageError

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

def findAccountByEmail(email): #Finds an account that matches a given email
    account = db.session.execute(db.select(Account).filter_by(email=email)).scalar()
    return account

def checkUsername(input):
    # Define the pattern for allowed characters
    pattern = r'^[a-zA-Z0-9_]+$'
    
    # Use re.match to check if the input matches the pattern
    if re.match(pattern, input):
        return True
    else:
        return False

def deleteAccount(username=None):
    if username is None:
        username = session.get('username')
    account = findAccount(username)
    db.session.delete(account)
    db.session.commit()
    flash('Successfully Deleted Account','success')

def newPassword(request):
    account = findAccount()
    new_password = request.form.get('new-password')
    old_password = request.form.get('old-password')
    username = account.username
    if not account.check_password(old_password): #Checks if the old password is correct
        flash('Current password is incorrect','error')
    elif new_password == username: # checks if the new password is the same as the username
        flash('Password cannot be the same as the username','error')
    elif len(new_password) < 8:
        flash('Password must be at least 8 characters long','error')
    elif new_password == old_password: #Checks if the new password is the same as the old password
        flash('New password cannot be the same as the old password','error')
    else:
        account.password = new_password
        db.session.commit()
        flash('Password changed successfully','success')

def changeDisplay(request):
    account = findAccount()
    new_name = request.form.get('displayname')
    account.displayname = new_name
    db.session.commit()
    flash(f'Display Name Changed to {account.displayname}','success')

def changeUsername(request):
    account = findAccount()
    new_name = request.form.get('username')
    session['username'] = new_name
    account.username = new_name
    db.session.commit()
    flash(f'Username Changed to {account.displayname}','success')


def changePFP(request):
    account = findAccount()
    try:
        img = Image.open(request.files['file'])
        img = ImageOps.fit(img,(200,200)) #sets the file resolution
        temp_file = BytesIO()
        img.save(temp_file, format="PNG")
        account.photo = temp_file.getvalue()
        db.session.commit()
        flash('Updated Photo Successfully','success')
    except UnidentifiedImageError:
        flash('Unsupported Image Type','error')
    except Exception as e:
        flash(f'An Error Occured: {e}')

def changeBio(request):
    account = findAccount()
    new_userdata = account.userdata.copy()  # Create a copy of the existing userdata
    new_userdata['bio'] = request.form.get('bio')  # Update the bio field
    account.userdata = new_userdata 
    db.session.commit()
    flash('Bio Updated Successfully','success')