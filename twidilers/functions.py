from .models import Account,db,Post
from flask import session,flash,Request,current_app
import re #for regular expressions
from io import BytesIO
from PIL import Image, ImageOps, UnidentifiedImageError
import sqlalchemy
import requests

def save():
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f'An error occured: {e}')
        
def findAccount(username=None) -> Account|None: #Finds an account that matches a given username that defaults to the session username
    if username is None:
        username = session.get('username')
    account = db.session.execute(db.select(Account).filter_by(username=username)).scalar()
    return account

def findAccountByEmail(email) -> Account|None: #Finds an account that matches a given email
    account = db.session.execute(db.select(Account).filter_by(email=email)).scalar()
    return account

def checkUsername(input) -> bool:
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

def newPassword(request:Request):
    account = findAccount()
    new_password = request.form.get('new-password')
    old_password = request.form.get('old-password',None)
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

def changeDisplay(request:Request):
    account = findAccount()
    new_name = request.form.get('displayname')
    account.displayname = new_name
    db.session.commit()
    flash(f'Display Name Changed to {account.displayname}','success')

def changeUsername(request:Request):
    account = findAccount()
    new_name = request.form.get('username')
    account.username = new_name
    account.setup = True
    try:
        db.session.commit()
        flash(f'Username Changed to {account.username}','success')
        session['username'] = new_name
    except sqlalchemy.exc.IntegrityError: #Instead of catching all errors and hiding them, i am catching integrity and then sending the rest to debugger
        flash('Username already taken','error')
        db.session.rollback()

def findPost(post_id) -> Post|None:
    post = db.session.execute(db.select(Post).filter_by(id=post_id)).scalar()
    return post

def changePFP(request:Request):
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

def changeBio(request:Request):
    account = findAccount()
    new_userdata = account.userdata.copy()  # Create a copy of the existing userdata
    new_userdata['bio'] = request.form.get('bio')  # Update the bio field
    account.userdata = new_userdata 
    db.session.commit()
    flash('Bio Updated Successfully','success')

def formatImage(image_bytes:bytes) -> bytes:
    img = Image.open(BytesIO(image_bytes))
    img = ImageOps.fit(img,(200,200)) #sets the file resolution
    temp_file = BytesIO()
    img.save(temp_file, format="PNG")
    return temp_file.getvalue()

def checkCaptcha(response):
    data = requests.post("https://api.hcaptcha.com/siteverify",data={"secret":current_app.config["HCAPTCHA_SECRET"],"response":response})
    return data.json()['success']