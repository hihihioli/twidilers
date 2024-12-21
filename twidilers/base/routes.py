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
from ..functions import findAccount,save #Custom functions, like save()

# Make sure to use url_for('.feed') and not url_for('.page',page='feed')

@app.post('/login')
def login():
    username = request.form.get('username') #Retrieves the username and password from the form
    password = request.form.get('password')
    account = db.session.execute(db.select(Account).filter_by(username=username)).scalar() #Finds an account with the username as the submitted one
    if account: #Checks if the given account exists
        if account.check_password(password): #Checks if the account's logged password is the same as the inputted password
            flash('Login Successful!','success')
            session['username'] = username #Sets session data to be used on other pages
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
        content = 'No Content'
    if not title:
        title = 'No Title'
    date_utc = datetime.datetime.now(datetime.timezone.utc)
    new_post = Post(title=title,content=content,date=date_utc,author=findAccount())
    db.session.add(new_post)
    db.session.commit()
    return redirect(url_for('.page',page='feed'))

@app.post('/sign_up')
def sign_up():
        #Handle sign up stuff here
        new_username=request.form.get('username').lower() #Gets username and passwords that were inputted into the form
        password1=request.form.get('password1')
        password2=request.form.get('password2')
        if not new_username or not password1 or not password2: #Makes sure that the username or password slots are not empty
            flash('Please enter a username and password','error')
            return redirect(url_for('.page',page='sign_up'))
        if password1 == password2: #Checks if the passwords match
            new_account = Account(username=new_username,password=password1,displayname=new_username)
            db.session.add(new_account)
            try:
                db.session.commit()               #I am using db.session.commit() instead of save() because I want to handle this error separately
            except sqlalchemy.exc.IntegrityError: #Instead of catching all errors and hiding them, i am catching integrity and then sending the rest to debugger
                flash('Username already exists','error')
                db.session.rollback()
                return redirect(url_for('.page',page='sign_up'))
            flash('User created successfully','success')
            return redirect(url_for('.page',page='login'))
        flash('Passwords do not match','error')
        return redirect(url_for('.page',page='sign_up'))


@app.post('/settings')
def settings(): #Handles the forms
    if 'delete' in request.form: #The user wants to delete their account
        account = findAccount()
        db.session.delete(account)
        db.session.commit()
        flash('Successfully Deleted Account','success')
        return redirect(url_for('.logout')) 
    elif 'change-name' in request.form: #The user wants to change their display name
        account = findAccount()
        new_name = request.form.get('change-name')
        account.displayname = new_name
        save()
        flash(f'Display Name Changed to {account.displayname}','success')
        return redirect(url_for('.page',page='settings'))
    else: #The user wants to update their pfp
        account = findAccount()
        if 'file' in request.files:
            try:
                img = Image.open(request.files['file'])
                img = ImageOps.fit(img,(512,512))
                temp_file = BytesIO()
                img.save(temp_file, format="PNG")
                account.photo = temp_file.getvalue()
                db.session.commit()
                flash('Updated Photo Successfully','success')
            except UnidentifiedImageError:
                flash('Unsupported Image Type','error')
            except Exception as e:
                flash(f'An Error Occured: {e}')
        else:
            flash('No File Selected','error')
        return redirect(url_for('.page',page='settings'))

@app.route('/user/<username>/')
def profile(username):
    account = findAccount(username)
    if account is None:
        abort(404)
    posts = sorted(account.posts, key=lambda c: c.date, reverse=True)[:3]
    if username == session.get('username'): #Checks if the profile the user is trying to access belongs to the user
        return render_template('profile.html',account=account, posts=posts, owner=1)
    return render_template('profile.html',account=account, posts=posts,owner=0)

@app.post('/user/<username>/')
def password(username):
    if username == session.get('username'):
        account = findAccount()
        new_password = request.form.get('change-password')
        account.password = new_password
        db.session.commit()
        flash('Password changed successfully','success')
        return redirect(f'/user/{username}')
    else:
        flash('A desync error occured','error')
        return redirect(f'/user/{username}')
        

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
