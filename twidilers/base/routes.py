"""
The file for routes that need extra processing, such as processing a login.
"""
#Imports
from flask import current_app, render_template, abort, request,redirect,url_for,flash, session
from jinja2 import TemplateNotFound
import sqlalchemy

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from .decorators import * #The custom decorators
from ..models import * #Database models, like Account
from ..functions import * #Custom functions, like save()

@app.post('/login')
def login():
    username = request.form.get('username') #Retrieves the username and password from the form
    password = request.form.get('password')
    account = db.session.execute(db.select(Account).filter_by(username=username)).scalar() #Finds an account with the username as the submitted one
    if account: #Checks if the given account exists
        if account.password == password: #Checks if the account's logged password is the same as the inputted password
            flash('Login Successful!','success')
            session['username'] = username #Sets session data to be used on other sites
            return redirect('/login')
    flash('Username or password is incorrect. Change account details or create an account','error')
    return redirect('/login')

@app.post('/sign_up')
def sign_up():
    try:
        #Handle sign up stuff here
        new_username=request.form.get('username') #Gets username and passwords that were inputted into the form
        password1=request.form.get('password1')
        password2=request.form.get('password2')
        if not new_username or not password1 or not password2: #Makes sure that the username or password slots are not empty
            flash('Please enter a username','error')
            return redirect('/sign_up')
        if password1 == password2: #Checks if the passwords match
            new_account = Account(username=new_username,password=password1)
            db.session.add(new_account)
            db.session.commit() #For now use db.session.commit() instead of save()
            flash('User created successfully','success')
            return redirect('/sign_up')
        flash('Passwords do not match','error')
        return redirect('/sign_up')
    except sqlalchemy.exc.IntegrityError: #If the username already exists
        flash('Username already exists','error')
        return redirect('/sign_up')