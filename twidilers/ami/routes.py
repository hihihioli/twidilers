from flask import current_app, render_template, abort, request, redirect, url_for, flash, session,jsonify
from sqlalchemy.orm import Mapped, mapped_column,relationship
from sqlalchemy import LargeBinary, DateTime, ForeignKey
from .models import Musics as Account
from . import ami as app #Blueprint imported as app so blueprint layer 
from ..objects import db
from ..functions import findAccount
from jinja2 import TemplateNotFound

@app.route('/sign-up',methods=["GET","POST"])
def sign_up():
    if request.method == 'GET': #If the user is trying to access the signup page
        instruments = ['Guitar','Piano','Drums','Violin','Flute','Saxophone','Trumpet','Clarinet','Cello','Harp','Trombone','Tuba','Oboe','Bassoon','French Horn','Viola','Double Bass','Recorder','Xylophone','Triangle',]
        genres = ['Rock','Pop','Jazz','Classical','Blues','Country','Hip Hop','Rap','Folk','Metal','R&B','Disco','Techno']
        return render_template('ami/sign_up.html',instruments=instruments,genres=genres)
    if request.method == "POST": #If the user finished signing up
        username = request.form.get('username')
        played = request.form.getlist('insts')
        heard = request.form.getlist('gens')
        account = Account(username = username,password = request.form.get('password1'),displayname=username.lower(),instruments=played,genres = heard)
        db.session.add(account)
        db.session.commit()
        print(findAccount(request.form.get('username')))
        return redirect(url_for('.index'))
    
@app.route('/')
def index():
        return render_template('ami/index.html')

@app.post('/login')
def login_handler():
    account = findAccount(request.form.get('username'))
    if account:
        if account.password == request.form.get('password'):
            session['username'] = account.username
            flash('Login successful','success')
            return redirect(url_for('.index'))
    flash('Username or password is incorrect','error')

@app.route('/logout')
def logout():
    session.pop('username',None)
    flash('Successfully logged out','success')
    return redirect(url_for('.index'))

@app.route('/browse')
def browse():
    accounts = db.session.execute(db.select(Account)).scalars().all()
    return render_template('ami/browse.html',accounts=accounts)

@app.route('/',defaults={'page':'index'}) 
@app.route('/<page>')
def page(page):
        password_protected = [ # the get pages that are password protected
                'browse',
                'profile',
        ]
        logout_protected = [
                'login',
                'sign-up',
                ]
        if page in password_protected and 'username' not in session:
                flash('You must be logged in to view this page','error')
                return redirect(url_for('.page',page='login'))
        if page in logout_protected and 'username' in session:
                flash("You're already logged in",'error')
                return redirect(url_for('.page',page='index'))
        try:
                return render_template(f'ami/{page}.html')
        except TemplateNotFound:
                abort(404)