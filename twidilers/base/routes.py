"""
The file for routes that need extra processing, such as processing a login.
"""
#Imports
from flask import current_app, render_template, abort, request,redirect,url_for
from jinja2 import TemplateNotFound

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 

"""
@app.post('/login')
def login():
    #Handles logins
"""

@app.post('/sign_up')
def sign_up():
    #Handle sign up stuff here
    return redirect('/sign_up')