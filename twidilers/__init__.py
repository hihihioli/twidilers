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

    #Some config stuff
    if not app.config['SECRET_KEY']: #set secret key if not set
        app.config['SECRET_KEY'] = str(uuid.uuid4())

    app.config['OAUTH2_PROVIDERS'] = {
        # Google OAuth 2.0 documentation:
        # https://developers.google.com/identity/protocols/oauth2/web-server#httprest
        'google': {
            'client_id': app.config.get('GOOGLE_CLIENT_ID'),
            'client_secret': app.config.get('GOOGLE_CLIENT_SECRET'),
            'authorize_url': 'https://accounts.google.com/o/oauth2/auth',
            'token_url': 'https://accounts.google.com/o/oauth2/token',
            'userinfo': {
                'url': 'https://www.googleapis.com/oauth2/v3/userinfo',
                'email': lambda json: json['email'],
            },
            'scopes': ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
        },

        # GitHub OAuth 2.0 documentation:
        # https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
        'github': {
            'client_id': app.config.get('GITHUB_CLIENT_ID'),
            'client_secret': app.config.get('GITHUB_CLIENT_SECRET'),
            'authorize_url': 'https://github.com/login/oauth/authorize',
            'token_url': 'https://github.com/login/oauth/access_token',
            'userinfo': {
                'url': 'https://api.github.com/user/emails',
                'email': lambda json: json[0]['email'],
            },
            'scopes': ['user:email'],
        },
    }

    from .objects import db,bcrypt,mail,models #Import the models from the models file and bcrypt object and the mail object
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

