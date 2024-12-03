#Imports
from flask import current_app, render_template, abort
from jinja2 import TemplateNotFound

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 

#we should change these to be in the function at the botton
#I figured out how to do url_for for the page one:
#url_for('.page',page='insert_page_here')
"""
@app.route('/login')
def login():
        return render_template('login.html')

@app.route('/sign_up')
def sign_up():
        return render_template('sign_up.html')

@app.route('/about')
def about():
        return render_template('about.html')

"""

@app.errorhandler(404)
def error404(error):
        return f'An error occured: {error}', 404 #probably should change this later

#The page handler for default pages
#For templates do: url_for('.page',page='insert_page_here')
@app.route('/',defaults={'page':'index'}) 
@app.route('/<page>')
def page(page):
        try:
                return render_template(f'{page}.html')
        except TemplateNotFound:
                abort(404)