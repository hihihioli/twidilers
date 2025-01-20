#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from .decorators import * #The custom decorators
from ..models import Account,Post,db #Database models, like Account
from ..functions import * #Custom functions, like save()

import flask
from sqlalchemy import desc

@app.route('/api/feed/all')
def all_posts():
    postlist:list[Account] = list(db.session.execute(db.select(Post).order_by(desc(Post.id))).scalars())
    return flask.jsonify(list({
        'id': post.id,
        'author_id': post.author_id,
        'author_url': url_for('.userapi',username=post.author.username,_external=True),
        'title': post.title,
        'content': post.content,
        'date': post.date,
    } for post in postlist))

@app.route('/api/user/<username>')
def userapi(username):
    account = findAccount(username)
    return flask.jsonify({
        'id': account.id,
        'username': account.username,
        'displayname': account.displayname,
        'photo_url': url_for('.get_pfp',username=account.username),
        'verified': account.verified,
        'setup': account.setup,
        'is_oauth': account.is_oauth,
        'userdata': account.userdata,
        'profile_link': url_for('.profile',username=account.username)
     })

@app.get('/api/users/all')
def all_users():
    userlist:list[Account] = list(db.session.execute(db.select(Account).order_by(desc(Account.id))).scalars())
    return flask.jsonify(list({
        'id': account.id,
        'username': account.username,
        'displayname': account.displayname,
        'photo_url': url_for('.get_pfp',username=account.username),
        'verified': account.verified,
        'setup': account.setup,
        'is_oauth': account.is_oauth,
        'userdata': account.userdata,
        'profile_link': url_for('.profile',username=account.username)
    } for account in userlist))

@app.route('/api/feed/user/<username>')
def followingapi(username):
    account = findAccount(username)
    followed_posts = (
        db.session.query(Post)
        .join(Account, account == Post.user_id)  # Join the Account table to access the followers relationship
        .filter(Account.id.in_([user.id for user in account.following]))
        .order_by(desc(Post.id))
        .all()
    )
    return flask.jsonify(list({
        'id': post.id,
        'author_id': post.author_id,
        'author_url': url_for('.userapi', username=post.author.username, _external=True),
        'title': post.title,
        'content': post.content,
        'date': post.date,
    } for post in followed_posts))


@app.get('/api/user/<username>/pfp')
def get_pfp(username):
    account = findAccount(username)
    account if account else flask.abort(404)
    if account.photo:
        return flask.send_file(BytesIO(account.photo),download_name=f'{username}_pfp.png')
    else:
        return flask.send_file(app.open_resource('static/images/default_user.png'),download_name=f'{username}_pfp.png')
