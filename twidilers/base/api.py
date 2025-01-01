"""
The file for routes that need extra processing, such as processing a login.
"""
#Imports
from flask import current_app, render_template, abort, request, redirect, url_for, flash, session,jsonify,send_file
import sqlalchemy
import datetime
from io import BytesIO
from PIL import Image, ImageOps, UnidentifiedImageError
#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from .decorators import login_required #The custom decorators
from ..models import Account,Post,db #Database models, like Account
from ..functions import findAccount,save,checkUsername#Custom functions, like save()

# Make sure to use url_for('.feed') and not url_for('.page',page='feed')

@app.post('/login')
def login():
    username = request.form.get('username') #Retrieves the username and password from the form
    password = request.form.get('password')
    account = db.session.execute(db.select(Account).filter_by(username=username)).scalar() #Finds an account with the username as the submitted one
    if not account: #Checks if the given account exists
        account = db.session.execute(db.select(Account).filter_by(displayname=username)).scalar()
    if account:
        if account.check_password(password): #Checks if the account's logged password is the same as the inputted password
            flash('Login Successful!','success')
            session['username'] = username.lower() #Sets session data to be used on other pages
            session['filter'] = 0
            return redirect(url_for('.page',page='index'))
    flash('Username or password is incorrect. Change account details or create an account','error')
    return redirect(url_for('.page',page='login'))

@app.route('/logout')
def logout():
    session.pop('username',None) #remove username from session, effectively logging them out
    flash('Successfully logged out','success')
    return redirect(url_for('.page',page='login'))

@app.post('/post')
@login_required
def write_post():
    title = request.form.get('title')
    content = request.form.get('post-content')
    if not content:
        flash('Post cannot be empty','error')
        return redirect(url_for('.page',page='post'))
    flash('Post successfully created','success')
    date_utc = datetime.datetime.now(datetime.timezone.utc)
    new_post = Post(title=title,content=content,date=date_utc,author=findAccount())
    db.session.add(new_post)
    db.session.commit()
    account = findAccount()
    for follower in account.followers:
        follower.notifications.append(db.session.execute(db.select(Post).filter_by(title=title)).scalar())
    return redirect(url_for('.page',page='feed'))

@app.post('/feed')
@login_required
def filter():
    placeholder = 1
    if placeholder:
        session['filter'] = 1
        flash("You're now seeing only people you follow", 'success')
    else:
        session['filter'] = 0
        flash("You're seeing everything now", 'success')
    return redirect(url_for('.page', page='feed'))

@app.post('/sign_up')
def sign_up():
    #Sets the variables to the form data
    display_name = request.form.get('username')
    new_username=request.form.get('username').lower()
    if not checkUsername(new_username):
        flash("Only a-z,A-Z,0-9,_ Allowed","error")
        return redirect(url_for('.page',page='sign_up'))
    password1=request.form.get('password1')
    password2=request.form.get('password2')
    email=request.form.get('email')
    #Makes sure that the slots are not empty
    if not new_username or not password1 or not password2 or not email: 
        flash('Please enter a username, password, and email','error')
        return redirect(url_for('.page',page='sign_up'))
    if password1 == password2: #Checks if the passwords match
        new_account = Account(username=new_username,password=password1,displayname=display_name)
        db.session.add(new_account)
        try:
            db.session.commit()               #I am using db.session.commit() instead of save() because I want to handle this error separately
        except sqlalchemy.exc.IntegrityError: #Instead of catching all errors and hiding them, i am catching integrity and then sending the rest to debugger
            flash('Username already exists','error')
            db.session.rollback()
            return redirect(url_for('.page',page='sign_up'))
        # makes sure the user didn't do anything insecure with there password
        if password1 == new_username or password1 == email:
            flash('Password cannot be the same as the username or email','error')
            return redirect(url_for('.page',page='sign_up'))
        flash('User created successfully','success')
        return redirect(url_for('.page',page='login'))
    flash('Passwords do not match','error')
    return redirect(url_for('.page',page='sign_up'))


@app.post('/settings')
def settings(): #Handles the settings page
    if 'delete' in request.form: #The user wants to delete their account
        account = findAccount()
        db.session.delete(account)
        db.session.commit()
        flash('Successfully Deleted Account','success')
        return redirect(url_for('.logout')) 
    elif 'new-password' in request.form: #The user wants to change their password
        account = findAccount()
        new_password = request.form.get('new-password')
        old_password = request.form.get('old-password')
        if account.check_password(old_password):
            account.password = new_password
            db.session.commit()
            flash('Password changed successfully','success')
        else:
            flash('Current password is incorrect','error')
        return redirect(url_for('.page',page='settings'))
    elif 'change-name' in request.form: #The user wants to change their display name
        account = findAccount()
        new_name = request.form.get('change-name')
        account.displayname = new_name
        save()
        flash(f'Display Name Changed to {account.displayname}','success')
        return redirect(url_for('.page',page='settings'))
    elif 'file' in request.files: #The user wants to update their pfp
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
        return redirect(url_for('.page',page='settings'))
    elif 'bio' in request.form: #The user wants to update their bio
        account = findAccount()
        new_userdata = account.userdata.copy()  # Create a copy of the existing userdata
        new_userdata['bio'] = request.form.get('bio')  # Update the bio field
        account.userdata = new_userdata 
        db.session.commit()
        flash('Bio Updated Successfully','success')
        return redirect('/settings')
    else: # We don't recognize the form. This is a catch all
        flash('Something went wrong','error')
        return redirect('/settings')

@app.route('/user/<username>/')
@login_required
def profile(username):
    account = findAccount(username)
    if account is None:
        abort(404)
    posts = sorted(account.posts, key=lambda c: c.date, reverse=True)[:3]
    if username == session.get('username'): #Checks if the profile the user is trying to access belongs to the user
        owner = 1
    else:
        owner = 0
    return render_template('profile.html',account=account, posts=posts,owner=owner,date=account.userdata['joined'],bio=account.userdata['bio'])

@app.post('/user/<username>/')
@login_required
def profaction(username):
    if 'change-name' in request.form: #The user wants to change their display name
        if username == session.get('username'):
            account = findAccount()
            new_name = request.form.get('change-name')
            account.displayname = new_name
            save()
            flash(f'Display Name Changed to {account.displayname}','success')
            return redirect(url_for('.profile',username=username))
        else:
            flash('A desync 1 error occured','error')
            return redirect(url_for('.profile',username=username))
    elif 'follow-button' in request.form:
        account = findAccount()
        account.following.append(findAccount(username))
        db.session.commit()
        flash(f'You are now following {username}')
        return redirect(url_for('.profile',username=username))
    else:
        flash('A desync 2 error occured','error')
        return redirect(url_for('.profile',username=username))
        
        

@app.get('/user/<username>/pfp')
def get_pfp(username):
    account = findAccount(username)
    account if account else abort(404)
    if account.photo:
        return send_file(BytesIO(account.photo),download_name=f'{username}_pfp.png')
    else:
        return send_file(app.open_resource('static/images/default_user.png'),download_name=f'{username}_pfp.png')
    
@app.get('/post/<post_id>')
def post(post_id):
    post = db.session.execute(db.get_or_404(post_id)).scalar()
    return render_template('postinfo.html',post=post)
