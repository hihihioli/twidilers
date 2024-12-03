"""
The file for routes that need extra processing, such as processing a login.
"""
#Imports
from flask import current_app, render_template, abort, request,redirect,url_for,flash, session
from jinja2 import TemplateNotFound

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from ..models import *
from ..functions import *

@app.post('/login')
def login():
    username = request.form.get('username') #Retrieves the username and password from the form
    password = request.form.get('password')
    account = db.session.execute(db.select(Account).filter_by(username=username)).scalar() #Finds an account with the username as the submitted one
    if account: #Checks if the given account exists
        if account.password == password:
            flash('Login Successful!','success')
            session['username'] = username
            return redirect('/login')
    flash('Username or password is incorrect. Change account details or create an account','error')
    return redirect('/login')

@app.post('/sign_up')
def sign_up():
    #Handle sign up stuff here
    new_username=request.form.get('username')
    password1=request.form.get('password1')
    password2=request.form.get('password2')
    if new_username == '': #Checks if the username is empty and flashes an error if it is
        flash('Please enter a username','error')
        return redirect('/sign_up')
    accounts = db.session.execute(db.select(Account).order_by(Account.username)).scalars() # Gets all accounts from the database
    for account in accounts: #checks if the username already exists
        if account.username == new_username:
            flash('Username already exists','error')
            return redirect('/sign_up')
    if password1 == password2: #Checks if the passwords match and raises an error if they dont
        new_account = Account(username=new_username,password=password2)
        db.session.add(new_account) #Creates the account and adds it to the database
        save() #Commits the changes and rolls back if there is an error
        flash('User created successfully','success')
        return redirect('/sign_up')
    flash('Passwords do not match','error')
    return redirect('/sign_up')