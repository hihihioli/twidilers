'''
Welcome to Twidilers App! Backend by Derin and Oliver. Frontend by Eamon. 
'''

from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv() #load the environment variables from .env

def create_app():
    app = Flask(__name__, #Create the app (woah)
                static_folder='resources',  #Named resources to not interfere with base blueprint static folder
                static_url_path='/resources')
    app.config.from_prefixed_env() #Automatically sets the app's config variables based on the environment variables (with 'FLASK_' as prefix)

    from .base import base #Import the base blueprint
    app.register_blueprint(base) #Register the base blueprint at root prefix
    
    return app #Return the app to the runtime

