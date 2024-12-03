"""
The file for routes that need extra processing, such as processing a login.
"""
#Imports
from flask import current_app, render_template, abort, request
from jinja2 import TemplateNotFound

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 

"""
@app.post('/login')
def login():
    #Handles logins
"""