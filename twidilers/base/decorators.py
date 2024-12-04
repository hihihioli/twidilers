"""
Custon decorators for our view.
"""
#Imports
from functools import wraps #The wrapper so it can be a decorator
from flask import session, redirect, url_for,flash

#A decorator for when login is required
def login_required(f): #'f' is the function that the decorator is acting on
    @wraps(f) #Passing 'f' to wraps
    def decorated_function(*args, **kwargs): #This function runs before the function its acting on
        if not session['username']:
            flash('You must be logged in to view this page','error')
            return redirect(url_for('.page',page='login')) #Redirect if username isn't in the session
        return f(*args, **kwargs) #Return the function it acting on and pass it its arguments
    return decorated_function #return the function we just made

def admin_required(f): #'f' is the function that the decorator is acting on
    @wraps(f) #Passing 'f' to wraps
    def decorated_function(*args, **kwargs): #This function runs before the function its acting on
        if not session['username'] == 'admin03':
            flash(f"Account {session['username']} does not have necessary permissions to view this page",'error')
            return redirect(url_for('.page',page='index')) #Redirect if username isn't in the session
        return f(*args, **kwargs) #Return the function it acting on and pass it its arguments
    return decorated_function #return the function we just made