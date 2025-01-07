"""
The oauth2 routes. Taken from https://blog.miguelgrinberg.com/post/oauth-authentication-with-flask-in-2023.
"""

#Our objects
from . import base as app #Blueprint imported as app so blueprint layer
from .decorators import login_prohibited
from ..functions import findAccountByEmail,formatImage
from ..models import Account
from ..objects import db
from .email import sendWelcome

#Imports
from flask import current_app, redirect, url_for, session, abort, request, flash,Response
from urllib.parse import urlencode
import secrets
import requests
import uuid

@app.route('/authorize/<provider>') #Redirect the user to the OAuth2 provider authorization URL
@login_prohibited
def oauth2_authorize(provider):
    provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)
    if provider_data is None:
        abort(404)

    # generate a random string for the state parameter
    session['oauth2_state'] = secrets.token_urlsafe(16)

    # create a query string with all the OAuth2 parameters
    qs = urlencode({
        'client_id': provider_data['client_id'],
        'redirect_uri': url_for('.oauth2_callback', provider=provider,
                                _external=True),
        'response_type': 'code',
        'scope': ' '.join(provider_data['scopes']),
        'state': session['oauth2_state'],
    })

    # redirect the user to the OAuth2 provider authorization URL
    return redirect(provider_data['authorize_url'] + '?' + qs)

@app.route('/callback/<provider>')
@login_prohibited
def oauth2_callback(provider):
    provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider) #Get the provider data
    if provider_data is None:
        abort(404)
        # if there was an authentication error, flash the error messages and exit

    if 'error' in request.args:
        for k, v in request.args.items():
            if k.startswith('error'):
                flash(f'{k}: {v}','error')
        return redirect(url_for('.page',page='index'))
    
    # make sure that the state parameter matches the one we created in the
    # authorization request
    if request.args['state'] != session.get('oauth2_state'):
        return redirectToProvider(provider)

    # make sure that the authorization code is present
    if 'code' not in request.args:
        return redirectToProvider(provider)
    
    # exchange the authorization code for an access token
    response = requests.post(provider_data['token_url'], data={
        'client_id': provider_data['client_id'],
        'client_secret': provider_data['client_secret'],
        'code': request.args['code'],
        'grant_type': 'authorization_code',
        'redirect_uri': url_for('.oauth2_callback', provider=provider,
                                _external=True),
    }, headers={'Accept': 'application/json'})
    if response.status_code != 200:
        return redirectToProvider(provider)
    oauth2_token = response.json().get('access_token')
    if not oauth2_token:
        return redirectToProvider(provider)

    # use the access token to get the user's email address
    response = requests.get(provider_data['email']['url'], headers={
        'Authorization': 'Bearer ' + oauth2_token,
        'Accept': 'application/json',
    })

    if response.status_code != 200:
        provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)
        abort(401)
    email = provider_data['email']['email'](response.json())
    account = findAccountByEmail(email)

    if account is None:
        response = requests.get(provider_data['userdata']['url'], headers={
            'Authorization': 'Bearer ' + oauth2_token,
            'Accept': 'application/json',
        })
        name = provider_data['userdata']['name'](response.json())
        picture = requests.get(provider_data['userdata']['picture'](response.json())).content
        print(picture)
        account = Account(email=email,verified=True,username=str(uuid.uuid4()),is_oauth=True,displayname=name,photo=formatImage(picture))
        db.session.add(account)
        db.session.commit()
        flash('Account Created','success')
        sendWelcome(account)
        

    session['username'] = account.username
    return redirect(url_for('.page', page='index'))

def redirectToProvider(provider:str) -> Response:
    provider_data = current_app.config['OAUTH2_PROVIDERS'].get(provider)
    if provider_data is None:
        abort(404)

    # generate a random string for the state parameter
    session['oauth2_state'] = secrets.token_urlsafe(16)

    # create a query string with all the OAuth2 parameters
    qs = urlencode({
        'client_id': provider_data['client_id'],
        'redirect_uri': url_for('.oauth2_callback', provider=provider,
                                _external=True),
        'response_type': 'code',
        'scope': ' '.join(provider_data['scopes']),
        'state': session['oauth2_state'],
    })

    # redirect the user to the OAuth2 provider authorization URL
    return redirect(provider_data['authorize_url'] + '?' + qs)