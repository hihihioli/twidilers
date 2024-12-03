"""
This is the main blueprint for the website.
"""
#imports
from flask import Blueprint

base = Blueprint('base', __name__,template_folder='templates',static_folder='static') #make the blueprint

from . import generic_routes #Import the routes from routes.py