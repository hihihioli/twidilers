"""
The route that displays generic html pages.
"""
#Imports
from flask import render_template, abort,session, flash,redirect,url_for
from jinja2 import TemplateNotFound

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from . import context_processors #Import the context processors
from . import routes #the routes
#Moved custom routes to routes.py(routes like login)

@app.errorhandler(404)
def error404(error):
        return f'An error occured: {error}', 404 #probably should change this later

#The page handler for default pages
#For templates do: url_for('.page',page='insert_page_here')
@app.route('/',defaults={'page':'index'}) 
@app.route('/<page>')
def page(page):
        password_protected = [ # the get pages that are password protected
                'feed',
                'post',
                'profile',
        ]
        if page in password_protected and 'username' not in session:
                flash('You must be logged in to view this page','error')
                return redirect(url_for('.page',page='login')) #Redirect if username isn't in the session
        try:
                return render_template(f'{page}.html')
        except TemplateNotFound:
                abort(404) #404 if template not found