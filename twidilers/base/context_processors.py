from . import base as app
from flask import session
from ..models import *
from ..functions import findAccount

@app.context_processor
def inject_post_list(): #The post list as a context processor
    if 'username' in session: #Check for username
        postlist = lambda: list(db.session.execute(db.select(Post).order_by(desc(Post.id))).scalars()) #A lambda that return the post list as a list
        return dict(postlist=postlist)
    return dict(postlist=lambda: []) #Return a function that return an empty list instead of querying the db

@app.context_processor
def inject_account(): #The account finder
    if 'username' in session:
        return dict(findAccount=findAccount)
    return dict()