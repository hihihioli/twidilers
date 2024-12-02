from flask import current_app, render_template, abort
from jinja2 import TemplateNotFound

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 



@app.errorhandler(404)
def error404(error):
        return f'An error occured: {error}', 404 #probably should change this later

@app.route('/',defaults={'page':'index'})
@app.route('/<page>')
def page(page):
        return render_template(f'{page}.html')
    