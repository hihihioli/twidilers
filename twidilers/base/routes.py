"""
The file for routes that need extra processing, such as processing a login.
"""
#Imports
from flask import current_app, render_template, abort, request,redirect,url_for,flash
from jinja2 import TemplateNotFound

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from ..models import *
from ..functions import *
"""
@app.post('/login')
def login():
    #Handles logins
"""

@app.post('/sign_up')
def sign_up():
    #Handle sign up stuff here
    new_username=request.form.get('username')
    password1=request.form.get('password1')
    password2=request.form.get('password2')
    accounts = db.session.execute(db.select(Account).order_by(Account.username)).scalars()
    if new_username == '':
        flash('Please enter a username','error')
        return redirect('/sign_up')
    for account in accounts:
        if account.username == new_username:
            flash('Username already exists','error')
            return redirect('/sign_up')
    if password1 == password2:
        new_account = Account(username=new_username,password=password2)
        db.session.add(new_account)
        save()
        print(db.session.execute(db.select(Account).filter_by(username=new_username)).scalar()) # Remove this!!! #
        flash('User created successfully','success')
        return redirect('/sign_up')
    flash('Passwords do not match','error')
    return redirect('/sign_up')