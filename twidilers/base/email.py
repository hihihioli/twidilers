"""
Various functions for sending emails.
"""

from flask_mail import Message #Message object
from flask import render_template,url_for, current_app
from flask.ctx import AppContext
from threading import Thread #Thread object

#Our objects
from ..objects import mail
from ..models import Account

def sendAsyncEmail(app_context:AppContext,msg:Message) -> None: #Send an email asynchronously
    app_context.push()
    mail.send(msg)




def sendVerification(user:Account) -> None: #Send a verification code
    email = user.email
    msg = Message(subject="Verification Code For twidilers.com")
    msg.add_recipient(email)
    msg.html = render_template('emails/new-verification.html',link=url_for('.verify',token=user.get_verify_token(),_external=True))

    Thread(target=sendAsyncEmail, args=(current_app.app_context(), msg)).start()

def sendWelcome(user:Account) -> None: #Send a welcome email
    email = user.email
    msg = Message(subject="Welcome to Twidilers!")
    msg.add_recipient(email)
    msg.html = render_template('emails/welcome.html',username=user.username)

    Thread(target=sendAsyncEmail, args=(current_app.app_context(), msg)).start()
