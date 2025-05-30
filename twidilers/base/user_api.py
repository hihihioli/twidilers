#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from .decorators import * #The custom decorators
from ..models import Account,Post,db #Database models, like Account
from ..functions import * #Custom functions, like save()

import flask
from sqlalchemy import desc

# This displays the paginated 15 posts on the feed page.
@app.route('/api/feed/all/<int:page>', methods=['GET'])
def all_posts(page):
    POSTS_PER_PAGE = 15
    offset = (page - 1) * POSTS_PER_PAGE
    postlist:list[Post] = (
        db.session.execute(
            db.select(Post)
            .order_by(desc(Post.id))
            .limit(POSTS_PER_PAGE)
            .offset(offset)
        ).scalars()
    )
    response = [
        {
            'id': post.id,
            'author_id': post.author_id,
            'author_url': url_for('.userapi', username=post.author.username, _external=True),
            'title': post.title,
            'content': post.content,
            'date': post.date,
            'likes': [user.id for user in post.liked_by]
        }
        for post in postlist
    ]
    return flask.jsonify(response)

# This displays information about the user
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

# This displays a list of all users
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

# This displays all posts by people *THE USER FOLLOWS*
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

# Quick easy hack to find current user
@app.route('/api/currentuser/')
def current_user():
    account = findAccount()
    return flask.jsonify({
        "username": account.username,
        "id": account.id,
    })

# General query for a post by ID
@app.route('/api/post/<int:post_id>')
def get_post(post_id):
    user = findAccount()
    liked = False
    post = findPost(post_id)
    if not post:
        flask.abort(404)
    if user in post.likes:
        liked = True
    return flask.jsonify({
        'id': post.id,
        'author_id': post.author_id,
        'author_url': url_for('.userapi', username=post.author.username, _external=True),
        'title': post.title,
        'content': post.content,
        'date': post.date,
        'like_count':post.like_count,
        'likes':post.likes,
        'liked':liked
    })

# Gets user profile picture
@app.get('/api/user/<username>/pfp')
def get_pfp(username):
    account = findAccount(username)
    account if account else flask.abort(404)
    if account.photo:
        return flask.send_file(BytesIO(account.photo),download_name=f'{username}_pfp.png')
    else:
        return flask.send_file(app.open_resource('static/images/default_user.png'),download_name=f'{username}_pfp.png')
