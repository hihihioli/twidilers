"""
Various functions for sending emails.
"""

from flask_mail import Message #Message object
from flask import render_template,url_for
#Our objects
from ..objects import mail
from ..models import Account

def sendVerification(user): #Send a verification code
    email = user.email
    msg = Message(subject="Verification Code For twidilers.com")
    msg.add_recipient(email)
    msg.html = render_template('emails/new-verification.html',link=url_for('.verify',token=user.get_verify_token(),_external=True))

    mail.send(msg)

def sendWelcome(user): #Send a welcome email
    email = user.email
    msg = Message(subject="Welcome to Twidilers!")
    msg.add_recipient(email)
    msg.html = render_template('emails/welcome.html',username=user.username)

    mail.send(msg)