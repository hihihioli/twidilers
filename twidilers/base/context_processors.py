from . import base as app
from flask import session
from ..models import *

@app.context_processor
def post_list(): #The post list as a context processor
    if 'username' in session: #Check for username
        postlist = lambda: list(db.session.execute(db.select(Post).order_by(desc(Post.id))).scalars()) #A lambda that return the post list as a list
        return dict(postlist=postlist)
    return dict(postlist=lambda: []) #Return a function that return an empty list instead of querying the db