from . import base as app
from ..models import Post,db
from ..functions import findAccount

from flask import session
from sqlalchemy import desc

@app.context_processor
def inject_post_list(): #The post list as a context processor
    if 'username' in session: #Check for username
        postlist = lambda: list(db.session.execute(db.select(Post).order_by(desc(Post.id))).scalars()) #A lambda that return the post list as a list
        return dict(postlist=postlist)
    return dict(postlist=lambda: []) #Return a function that return an empty list instead of querying the db

@app.context_processor
def inject_account(): #The account finder
    if 'username' in session:
        return dict(findAccount=findAccount) #Return the find account function
    return dict()