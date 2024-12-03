"""
The route that displays generic html pages.
"""
#Imports
from flask import current_app, render_template, abort
from jinja2 import TemplateNotFound

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from . import routes
#Moved custom routes to routes.py(routes like login)

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