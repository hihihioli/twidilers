from flask import current_app, render_template, abort, request, redirect, url_for, flash, session,jsonify
from sqlalchemy.orm import Mapped, mapped_column,relationship
from sqlalchemy import LargeBinary, DateTime, ForeignKey
from . import ami as app #Blueprint imported as app so blueprint layer 

@app.route('/')
def index():
    return render_template('ami/index.html')

@app.route('/login')
def login():
    return render_template('ami/login.html')

@app.route('/signup',methods=["GET","POST"])
def signup():
    if request.method == 'GET':
        return render_template('ami/signup.html')
    if request.method == "POST":
        return redirect(url_for('.index'))