"""
This is the main blueprint for the website.
"""
#imports
from flask import Blueprint

base = Blueprint('base', __name__,template_folder='templates',static_folder='static') #make the blueprint

from . import pages #Import the routes from generic_routes.py, which includes routes.py and context processors