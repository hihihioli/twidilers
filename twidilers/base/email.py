"""
Various functions for sending emails.
"""

from flask_mail import Message #Message object
from flask import render_template,url_for
#Our objects
from ..objects import mail

def sendVerification(user): #Send a verification code
    email = user.email
    msg = Message(subject="Verification Code For twidilers.com")
    msg.add_recipient(email)
    msg.html = render_template('emails/new-verification.html',code=user.verification_code,link=url_for('.verify',username=user.username))
    mail.send(msg)