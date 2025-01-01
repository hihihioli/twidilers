'''
Welcome to Twidilers App! Backend by Derin and Oliver. Frontend by Eamon. 
'''

#the imports
from flask import Flask, session
from dotenv import load_dotenv
import os
import uuid


def create_app():
    app = Flask(__name__, #Create the app (woah)
                static_folder='resources',  #Named resources to not interfere with base blueprint static folder
                static_url_path='/resources')
    app.config.from_prefixed_env() #Automatically sets the app's config variables based on the environment variables (with 'FLASK_' as prefix)

    if not app.config['SECRET_KEY']:
        app.config['SECRET_KEY'] = str(uuid.uuid4())

    from .objects import db,bcrypt,mail,models #Import the models from the models file and bcrypt object
    db.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)

    with app.app_context(): #Creates the tables for each class and adds it to the database
        db.create_all()
    
    from .base import base #Import the base blueprint
    app.register_blueprint(base) #Register the base blueprint at root prefix
    
    from .ami import ami #Import the base blueprint
    app.register_blueprint(ami,url_prefix='/ami/',name='ami') #Register the base blueprint at root prefix
    
    return app #Return the app to the runtime

