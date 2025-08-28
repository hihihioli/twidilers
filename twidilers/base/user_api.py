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
    response = [{
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'date': post.date,
        'likes': [u.id for u in post.liked_by],
        'author': {
            'id':         post.author.id,   
            'username':    post.author.username,
            'displayname': post.author.displayname,
            'photo_url':   url_for('.get_pfp', username=post.author.username, _external=True),
            'profile_link': url_for('.profile', username=post.author.username, _external=True)
        }
    } for post in postlist]
    return flask.jsonify(response)

# Displays posts by people the logged-in user follows
@app.route('/api/feed/following/<int:page>')
@login_required
def following_feed(page):
    POSTS_PER_PAGE = 15
    offset = (page - 1) * POSTS_PER_PAGE
    account = findAccount()
    
    following_ids = [user.id for user in account.following]
    
    postlist = (
        db.session.execute(
            db.select(Post)
            .filter(Post.author_id.in_(following_ids))
            .order_by(desc(Post.id))
            .limit(POSTS_PER_PAGE)
            .offset(offset)
        ).scalars()
    )
    
    response = [{
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'date': post.date,
        'likes': [u.id for u in post.liked_by],
        'author': {
            'id': post.author.id,   
            'username': post.author.username,
            'displayname': post.author.displayname,
            'photo_url': url_for('.get_pfp', username=post.author.username, _external=True),
            'profile_link': url_for('.profile', username=post.author.username, _external=True)
        }
    } for post in postlist]
    return flask.jsonify(response)

# Displays posts that logged-in user liked
@app.route('/api/feed/liked/<int:page>')
@login_required
def liked_feed(page):
    POSTS_PER_PAGE = 15
    offset = (page - 1) * POSTS_PER_PAGE
    account = findAccount()
    
    postlist = (
        db.session.execute(
            db.select(Post)
            .filter(Post.liked_by.contains(account))
            .order_by(desc(Post.id))
            .limit(POSTS_PER_PAGE)
            .offset(offset)
        ).scalars()
    )
    
    response = [{
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'date': post.date,
        'likes': [u.id for u in post.liked_by],
        'author': {
            'id': post.author.id,   
            'username': post.author.username,
            'displayname': post.author.displayname,
            'photo_url': url_for('.get_pfp', username=post.author.username, _external=True),
            'profile_link': url_for('.profile', username=post.author.username, _external=True)
        }
    } for post in postlist]
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

"""
Ideally there would be an API for changing user settings. Hopefully someone will add this api :)
@app.route('/api/currentuser/settings')
@login_required
def get_user_settings():
    account = findAccount()
    return flask.jsonify({
        ''
    })

@app.post('/api/currentuser/settings/<int:setting_id>')
@login_required
def change_user_settings(setting_id):
    account = findAccount()
"""    

#toggles like on post
@app.post('/api/post/<int:post_id>/like')
@login_required
def api_like(post_id):
    user = findAccount()
    post = findPost(post_id)
    if user in post.liked_by:
        post.liked_by.remove(user)
        db.session.commit()
        return jsonify({
            'liked': False, 
            'post_id': post_id
        })
    post.liked_by.append(user)
    db.session.commit()
    return jsonify({
        'liked': True,
        'post_id': post_id
    })

@app.delete('/api/post/<int:post_id>')
@login_required
def api_delete(post_id):
    post = findPost(post_id)
    if post.author != findAccount():
        return jsonify({'error':'not your post'}), 403
    db.session.delete(post)
    db.session.commit()
    flash('Post deleted','success')
    return jsonify({'deleted': True, 'post_id': post_id})

# Gets user profile picture
@app.get('/api/user/<username>/pfp')
def get_pfp(username):
    account = findAccount(username)
    account if account else flask.abort(404)
    if account.photo:
        return flask.send_file(BytesIO(account.photo),download_name=f'{username}_pfp.png')
    else:
        return flask.send_file(app.open_resource('static/images/default_user.png'),download_name=f'{username}_pfp.png')
