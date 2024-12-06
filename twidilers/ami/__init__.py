from flask import Blueprint

blue = Blueprint('base', __name__,template_folder='templates',static_folder='static')

from . import routes