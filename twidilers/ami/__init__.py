from flask import Blueprint

blue = Blueprint('blue', __name__,template_folder='templates',static_folder='static') #make the blueprint

from . import routes