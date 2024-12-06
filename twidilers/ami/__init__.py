from flask import Blueprint

ami = Blueprint('ami', __name__,template_folder='templates',static_folder='static') #make the blueprint

from . import routes