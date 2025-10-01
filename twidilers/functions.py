from .models import Account,db,Post
from flask import session,flash,Request,current_app, url_for
import re #for regular expressions
from io import BytesIO
from PIL import Image, ImageOps, UnidentifiedImageError
import sqlalchemy
import requests
import datetime

def save():
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f'An error occured: {e}')
        
def findAccount(username=None) -> Account|None: #Finds an account that matches a given username that defaults to the session username
    if username is None:
        username = session.get('username')
    account = db.session.execute(db.select(Account).filter_by(username=username.lower())).scalar()
    return account

def findAccountByEmail(email) -> Account|None: #Finds an account that matches a given email
    account = db.session.execute(db.select(Account).filter_by(email=email)).scalar()
    return account

def checkUsername(input) -> bool:
    # Define the pattern for allowed characters
    pattern = r'^[a-zA-Z0-9_]+$'
    
    # Use re.match to check if the input matches the pattern
    if re.match(pattern, input):
        return True
    else:
        return False

def deleteAccount(username=None):
    if username is None:
        username = session.get('username')
    account = findAccount(username)
    db.session.delete(account)
    db.session.commit()
    flash('Successfully Deleted Account','success')

def newPassword(request:Request):
    account = findAccount()
    new_password = request.form.get('new-password')
    old_password = request.form.get('old-password',None)
    username = account.username
    if not account.check_password(old_password): #Checks if the old password is correct
        flash('Current password is incorrect','error')
    elif new_password == username: # checks if the new password is the same as the username
        flash('Password cannot be the same as the username','error')
    elif len(new_password) < 8:
        flash('Password must be at least 8 characters long','error')
    elif new_password == old_password: #Checks if the new password is the same as the old password
        flash('New password cannot be the same as the old password','error')
    else:
        account.password = new_password
        db.session.commit()
        flash('Password changed successfully','success')

def changeDisplay(request:Request):
    account = findAccount()
    new_name = request.form.get('displayname')
    account.displayname = new_name
    db.session.commit()
    flash(f'Display Name Changed to {account.displayname}','success')

def changeUsername(request:Request):
    account = findAccount()
    old_name = account.username
    new_name = request.form.get('username').lower()
    new_name.lstrip('@')
    if not checkUsername(new_name):
        flash("Only letters, numbers, and underscores allowed in username","error")
        return
    account.username = new_name
    account.setup = True
    for post in account.posts:
        if post.is_reference:
            for act in post.references:
                ns = act.notifications.copy()
                for notif in ns:
                    if notif["author"] == old_name:
                        notif["author"] = new_name
                act.notifications = ns
    for act in account.followers:
                ns = act.notifications.copy()
                for notif in ns:
                    if notif["author"] == old_name:
                        notif["author"] = new_name
                act.notifications = ns
    try:
        db.session.commit()
        flash(f'Username Changed to {account.username}','success')
        session['username'] = new_name
    except sqlalchemy.exc.IntegrityError: #Instead of catching all errors and hiding them, i am catching integrity and then sending the rest to debugger
        flash('Username already taken','error')
        db.session.rollback()

def findPost(post_id) -> Post|None:
    post = db.session.execute(db.select(Post).filter_by(id=post_id)).scalar()
    return post

def findPostByDate(date_utc):
    post = db.session.execute(db.select(Post).filter_by(date=date_utc)).scalar()
    return post

# for checking if a user has a notif setting enabled
def checkNotifSettings(user, setting):
    account = findAccount(user)
    if account.notif_settings.get(setting, False):
        return True
    return False

#sends notification to user
def sendNotification(setting, user, author, post_id):
    # sends notification TO USER
    account = findAccount(user)
    if account:
        notifs = account.notifications.copy()
        date_utc = datetime.datetime.now(datetime.timezone.utc)
        post = findPost(post_id)
        notifs.append({
            "type": setting,
            "references": post.references,
            "author": author,
            "title": post.title,
            "content": post.content,
            "post_id": post_id,
            "date": date_utc.timestamp()
        })
        account.notifications = notifs

def deletePost(post):
    if not post:
        return
    for account in post.references:
        o = account.notifications.copy()
        for notif in o:
            if notif.get("date") == post.date:
                o.remove(notif)
    for account in post.author.followers:
        o = account.notifications.copy()
        for notif in o:
            if notif.get("date") == post.date:
                o.remove(notif)
        account.notifications = o
    db.session.delete(post)
    db.session.commit()

def changePFP(request:Request):
    account = findAccount()
    try:
        img = Image.open(request.files['file'])
        img = ImageOps.fit(img,(200,200)) #sets the file resolution
        temp_file = BytesIO()
        img.save(temp_file, format="PNG")
        account.photo = temp_file.getvalue()
        db.session.commit()
        flash('Updated Photo Successfully','success')
    except UnidentifiedImageError:
        flash('Unsupported Image Type','error')
    except Exception as e:
        flash(f'An Error Occured: {e}')

def changeBio(request:Request):
    account = findAccount()
    new_userdata = account.userdata.copy()  # Create a copy of the existing userdata
    new_userdata['bio'] = request.form.get('bio')  # Update the bio field
    account.userdata = new_userdata 
    db.session.commit()
    flash('Bio Updated Successfully','success')

def formatImage(image_bytes:bytes) -> bytes:
    img = Image.open(BytesIO(image_bytes))
    img = ImageOps.fit(img,(200,200)) #sets the file resolution
    temp_file = BytesIO()
    img.save(temp_file, format="PNG")
    return temp_file.getvalue()

def checkCaptcha(response):
    data = requests.post("https://api.hcaptcha.com/siteverify",data={"secret":current_app.config["HCAPTCHA_SECRET"],"response":response})
    return data.json()['success']

# -----------------------------
# API serialization helpers
# -----------------------------
MENTION_REGEX = re.compile(r'(?<![\w@])@([A-Za-z0-9_]{1,32})')

def extract_mentions(text:str) -> list[str]:
    """Return unique usernames mentioned in text via @username.

    Rules:
      - Start with @ not preceded by a word char or @ (prevents email user parts and @@).
      - Username chars: letters, numbers, underscore. Capped at 32 for sanity.
    """
    if not text:
        return []
    seen = set()
    mentions = []
    for match in MENTION_REGEX.finditer(text):
        uname = match.group(1).lower()
        if uname not in seen:
            seen.add(uname)
            mentions.append(uname)
    return mentions

def validate_mentions(usernames:list[str]) -> list[str]:
    """Filter list of usernames to only those that exist in the DB."""
    if not usernames:
        return []
    existing = db.session.execute(
        db.select(Account.username).filter(Account.username.in_(usernames))
    ).scalars().all()
    return list(existing)

def post_to_api_dict(post: Post, current_user: Account|None=None, *, external_urls: bool = True) -> dict:
    """Serialize a Post into a compact feed-friendly dict.

    Fields mirror the existing feed endpoints in user_api.py.
    """
    raw_mentions = extract_mentions(post.content)
    valid_mentions = validate_mentions(raw_mentions)
    mentions_current_user = bool(current_user) and current_user.username in valid_mentions
    return {
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'date': post.date,
        'likes': [u.id for u in post.liked_by],
        'mentions': valid_mentions,
        'mentions_current_user': mentions_current_user,
        'author': {
            'id':           post.author.id,
            'username':     post.author.username,
            'displayname':  post.author.displayname,
            'photo_url':    url_for('.get_pfp', username=post.author.username, _external=external_urls),
            'profile_link': url_for('.profile', username=post.author.username, _external=external_urls),
        },
    }

def post_detail_api_dict(post: Post, current_user: Account | None = None, *, external_urls: bool = True) -> dict:
    """Serialize a Post with additional details (author_url, like_count, liked).

    Used by the /api/post/<id> endpoint.
    """
    likes_list = [u.id for u in post.liked_by]
    liked = bool(current_user) and current_user.id in likes_list
    raw_mentions = extract_mentions(post.content)
    valid_mentions = validate_mentions(raw_mentions)
    return {
        'id': post.id,
        'author_id': post.author_id,
        'author_url': url_for('.userapi', username=post.author.username, _external=external_urls),
        'title': post.title,
        'content': post.content,
        'date': post.date,
        'like_count': len(likes_list),
        'likes': likes_list,
        'liked': liked,
        'mentions': valid_mentions,
        'mentions_current_user': bool(current_user) and current_user.username in valid_mentions,
    }