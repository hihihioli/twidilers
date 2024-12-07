"""
The file for routes that need extra processing, such as processing a login.
"""
#Imports
from flask import current_app, render_template, abort, request, redirect, url_for, flash, session,jsonify
import sqlalchemy
import datetime
#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from .decorators import * #The custom decorators
from ..models import * #Database models, like Account
from ..functions import * #Custom functions, like save()

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
    session.pop('username',None)
    return redirect(url_for('.page',page='login'))

@app.post('/post')
def post():
    title = request.form.get('title')
    author = session.get('username')
    content = request.form.get('post-content') #What does the next line do?
    decorators = ' '.join(value for value in [request.form.get('overline'),request.form.get('underline'),request.form.get('line-through'),request.form.get('wavy')] if value is not None)
    date_utc = datetime.datetime.now(datetime.timezone.utc)
    new_post = Post(title=title,content=content,author=author,date=date_utc,decorators=decorators)
    db.session.add(new_post)
    db.session.commit()
    return redirect(url_for('.page',page='feed'))

@app.post('/sign_up')
def sign_up():

        #Handle sign up stuff here
        new_username=request.form.get('username') #Gets username and passwords that were inputted into the form
        password1=request.form.get('password1')
        password2=request.form.get('password2')
        if not new_username or not password1 or not password2: #Makes sure that the username or password slots are not empty
            flash('Please enter a username','error')
            return redirect(url_for('.page',page='sign_up'))
        if password1 == password2: #Checks if the passwords match
            new_account = Account(username=new_username,password=password1)
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

    
@app.post('/profile')
def profile(): #The delete function
    if session['username']:
        account = findAccount()
        db.session.delete(account)
        db.session.commit()
        flash('Successfully Deleted Account','success')
    return redirect(url_for('.logout'))