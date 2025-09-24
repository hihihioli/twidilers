#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from .decorators import * #The custom decorators
from ..models import Account,Post,db #Database models, like Account
from ..functions import * #Custom functions, like save()

import flask
from sqlalchemy import desc
from io import BytesIO

# This displays the paginated 15 posts on the feed page.
@app.route('/api/feed/all/<int:page>', methods=['GET'])
def all_posts(page):
    POSTS_PER_PAGE = 15
    offset = (page - 1) * POSTS_PER_PAGE
    current = findAccount()
    postlist:list[Post] = (
        db.session.execute(
            db.select(Post)
            .order_by(desc(Post.id))
            .limit(POSTS_PER_PAGE)
            .offset(offset)
        ).scalars()
    )
    response = [post_to_api_dict(post, current_user=current) for post in postlist]
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
    
    response = [post_to_api_dict(post, current_user=account) for post in postlist]
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
    
    response = [post_to_api_dict(post, current_user=account) for post in postlist]
    return flask.jsonify(response)

# This displays information about the user
@app.route('/api/user/<username>')
def userapi(username):
    account = findAccount(username)
    return flask.jsonify({
        'id': account.id,
        'username': account.username,
        'displayname': account.displayname,
        'photo_url': flask.url_for('.get_pfp',username=account.username),
        'verified': account.verified,
        'setup': account.setup,
        'is_oauth': account.is_oauth,
        'userdata': account.userdata,
        'profile_link': flask.url_for('.profile',username=account.username)
     })

# This displays a list of all users
@app.get('/api/users/all')
def all_users():
    userlist:list[Account] = list(db.session.execute(db.select(Account).order_by(desc(Account.id))).scalars())
    return flask.jsonify(list({
        'id': account.id,
        'username': account.username,
        'displayname': account.displayname,
        'photo_url': flask.url_for('.get_pfp',username=account.username),
        'verified': account.verified,
        'setup': account.setup,
        'is_oauth': account.is_oauth,
        'userdata': account.userdata,
        'profile_link': flask.url_for('.profile',username=account.username)
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
    post = findPost(post_id)
    if not post:
        flask.abort(404)
    return flask.jsonify(post_detail_api_dict(post, user))

# Bulk user existence / data lookup
# POST { "usernames": ["alice","bob"] }
@app.post('/api/users/bulk')
def bulk_users():
    data = flask.request.get_json(silent=True) or {}
    names = data.get('usernames') or []
    if not isinstance(names, list):
        return flask.jsonify({'error':'usernames must be a list'}), 400
    # normalize & dedupe
    norm = []
    seen = set()
    for n in names:
        if not isinstance(n,str):
            continue
        u = n.strip().lstrip('@')
        if not u or u in seen:
            continue
        if not checkUsername(u):
            continue
        seen.add(u)
        norm.append(u)
    if not norm:
        return flask.jsonify({'users': []})
    rows = db.session.execute(
        db.select(Account).filter(Account.username.in_(norm))
    ).scalars().all()
    users = [{
        'username': r.username,
        'displayname': r.displayname,
        'photo_url': flask.url_for('.get_pfp', username=r.username),
        'profile_link': flask.url_for('.profile', username=r.username)
    } for r in rows]
    return flask.jsonify({'users': users})

#toggles like on post
@app.post('/api/post/<int:post_id>/like')
@login_required
def api_like(post_id):
    user = findAccount()
    post = findPost(post_id)
    if user in post.liked_by:
        post.liked_by.remove(user)
        db.session.commit()
        return flask.jsonify({
            'liked': False, 
            'post_id': post_id
        })
    post.liked_by.append(user)
    if checkNotifSettings(user.username, 'likes'):
        sendNotification('likes', post.author, user.username, post.id)
    db.session.commit()
    return flask.jsonify({
        'liked': True,
        'post_id': post_id
    })

@app.delete('/api/post/<int:post_id>')
@login_required
def api_delete(post_id):
    post = findPost(post_id)
    if post.author != findAccount():
        return flask.jsonify({'error':'not your post'}), 403
    db.session.delete(post)
    db.session.commit()
    flask.flash('Post deleted','success')
    return flask.jsonify({'deleted': True, 'post_id': post_id})

# Gets user profile picture
@app.get('/api/user/<username>/pfp')
def get_pfp(username):
    account = findAccount(username)
    account if account else flask.abort(404)
    if account.photo:
        return flask.send_file(BytesIO(account.photo),download_name=f'{username}_pfp.png')
    else:
        return flask.send_file(app.open_resource('static/images/default_user.png'),download_name=f'{username}_pfp.png')

# gets user settings
@app.post('/api/settings/<setting>')
@login_required
def get_setting(setting):
    account = findAccount()
    if setting not in ['reaction-toggle','post-notif-toggle','follow-toggle']:
        return flask.jsonify({'error':'invalid setting'}), 400
    if setting == 'reaction-toggle':
        query = 'likes'
    elif setting == 'post-notif-toggle':
        query = 'mentions'
    elif setting == 'follow-toggle':
        query = 'following'
    res = account.notif_settings[query]
    return flask.jsonify({setting:res})

# toggles user settings
@app.post('/api/settings/<setting>/toggle')
@login_required
def toggle_setting(setting):
    account = findAccount()
    if setting not in ['reaction-toggle','post-notif-toggle','follow-toggle']:
        return flask.jsonify({'error':'invalid setting'}), 400
    if setting == 'reaction-toggle':
        query = 'likes'
    elif setting == 'post-notif-toggle':
        query = 'mentions'
    elif setting == 'follow-toggle':
        query = 'following'
    current_value = account.notif_settings.get(query, False)
    new_value = not current_value
    account.notif_settings[query] = new_value
    db.session.commit()
    return flask.jsonify({setting: new_value})