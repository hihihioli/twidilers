from flask import current_app, render_template, abort, request, redirect, url_for, flash, session,jsonify
import sqlalchemy
from . import blue as app #Blueprint imported as app so blueprint layer 

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup',methods=["GET","POST"])
def signup():
    if request.method == 'GET':
        return render_template('signup.html')
    if request.method == "POST":
        pass