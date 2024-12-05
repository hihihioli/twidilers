"""
The file for routes that need extra processing, such as processing a login.
"""
#Imports
from flask import current_app, render_template, abort, request, redirect, url_for, flash, session,jsonify
import sqlalchemy
import datetime
#Our objects
from . import base as app #Blueprint imported as app so blueprint layer 
from .decorators import * #The custom decorators
from ..models import * #Database models, like Account
from ..functions import * #Custom functions, like save()

# Make sure to use url_for('.feed') and not url_for('.page',page='feed')

@app.post('/login')
def login():
    username = request.form.get('username') #Retrieves the username and password from the form
    password = request.form.get('password')
    account = db.session.execute(db.select(Account).filter_by(username=username)).scalar() #Finds an account with the username as the submitted one
    if account: #Checks if the given account exists
        if account.password == password: #Checks if the account's logged password is the same as the inputted password
            flash('Login Successful!','success')
            session['username'] = username #Sets session data to be used on other pages
            return redirect(url_for('.page',page='index'))
    flash('Username or password is incorrect. Change account details or create an account','error')
    return redirect(url_for('.page',page='login'))

@app.route('/logout')
def logout():
    session.pop('username',None)
    return redirect(url_for('.page',page='login'))

@app.route('/post', methods=['GET', 'POST'])
def post():
    if request.method =='GET':
        if 'username' in session:
            if session['username']:
                return render_template('post.html')
        else:
            return redirect(url_for('.feed'))
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('post-content')
        decorators = ' '.join(value for value in [request.form.get('overline'),request.form.get('underline'),request.form.get('line-through'),request.form.get('wavy')] if value is not None)
        date = datetime.datetime.now().strftime('%D')
        new_post = Post(title=title,content=content,author=session.get('username'),date=date,decorators=decorators)
        db.session.add(new_post)
        db.session.commit()
        return redirect(url_for('.feed'))

@app.post('/sign_up')
def sign_up():

        #Handle sign up stuff here
        new_username=request.form.get('username') #Gets username and passwords that were inputted into the form
        password1=request.form.get('password1')
        password2=request.form.get('password2')
        if not new_username or not password1 or not password2: #Makes sure that the username or password slots are not empty
            flash('Please enter a username','error')
            return redirect(url_for('.page',page='sign_up'))
        if password1 == password2: #Checks if the passwords match
            new_account = Account(username=new_username,password=password1)
            db.session.add(new_account)
            try:
                db.session.commit() #For now use db.session.commit() instead of save()
            except sqlalchemy.exc.IntegrityError: #If the username already exists
                flash('Username already exists','error')
                db.session.rollback()
                return redirect(url_for('.page',page='sign_up'))
            flash('User created successfully','success')
            return redirect(url_for('.page',page='login'))
        flash('Passwords do not match','error')
        return redirect(url_for('.page',page='sign_up'))

    
@app.route('/feed', methods=['GET', 'POST'])
@login_required
def feed():
    if request.method == 'GET':
        postlist = db.session.execute(db.select(Post).order_by(desc(Post.id))).scalars()
        return render_template('feed.html',postlist=list(postlist))
    if request.method == 'POST':
        return redirect(url_for('.feed'))
    
@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    if request.method == "GET": #If the user is visiting the page, gets the user's account using findAccount() (in functions.py) to display information on the webpage
        if 'username' in session: #Ensures that the user is logged in
            account = findAccount()
            return render_template("profile.html",account=account)
        else:
            flash('You must be logged in to view this page','error')
            return redirect(url_for('.page',page='login'))
    if request.method == "POST": #If the user is accessing the POST method (deleting theitr account), recieves the data from the fetch request in profile.html and deletes the account
        data = request.get_json()
        account = findAccount() 
        if account: #Ensures that the account exists and is the intended account to be deleted
            if account.username == data['account']:
                db.session.delete(account) #Removes the account from the database and save()s (in functions.py)
                save()
                session.pop('username',None) #Removes username from the session data
                flash('Account deleted successfully','success')
                response = { #Returns the data to the frontend
                        "message": "Data get!",
                        "recieved_data": data
                        }
                return jsonify(response)
            flash('An error occured','error')
            response = {
                        "message": "An error occured",
                        "recieved_data": data
                        }
            return jsonify(response) #Returns the data to the frontend
        flash('An error occured','error')
        response = {
                        "message": "An error occured",
                        "recieved_data": data
                        }
        return jsonify(response) #Returns the data to the frontend