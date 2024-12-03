"""
The file for routes that need extra processing, such as processing a login.
"""
#Imports
from flask import current_app, render_template, abort, request,redirect,url_for,flash
from jinja2 import TemplateNotFound
import sqlalchemy

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from .decorators import * #The custom decorators
from ..models import *
from ..functions import *

@app.post('/login')
def login():
    #Handles logins
    return redirect('/login')

@app.post('/sign_up')
def sign_up():
    try:
        #Handle sign up stuff here
        new_username=request.form.get('username')
        password1=request.form.get('password1')
        password2=request.form.get('password2')
        if not new_username:
            flash('Please enter a username','error')
            return redirect('/sign_up')
        if password1 == password2:
            new_account = Account(username=new_username,password=password2)
            db.session.add(new_account)
            db.session.commit() #For now use db.session.commit() instead of save()
            flash('User created successfully','success')
            return redirect('/sign_up')
        flash('Passwords do not match','error')
        return redirect('/sign_up')
    except sqlalchemy.exc.IntegrityError: #If the username already exists
        flash('Username already exists','error')
        return redirect('/sign_up')