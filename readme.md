# Useful links
## Dependencies
Want to learn more about one of the dependencies we use? Look no further!
* Turbo.js https://turbo.hotwired.dev/handbook/
* Flask https://flask.palletsprojects.com/en/stable/
* Google Oauth https://console.cloud.google.com/apis/credentials?authuser=6&project=twidilers&supportedpurview=project 
* Github Oauth https://github.com/settings/applications/2831103 

## Good tutorial sources
* https://blog.miguelgrinberg.com/category/Flask


# Bugs
* Feed JS is kind of broken
    * Re-add filter functionality


# Do before deployment:
* Oauth
    * Set google oAuth to deployment (see above for link)
        * Change uri to twidilers.com
    * Change github oAuth uri to twidilers.com
* TOS and PP (legally probably required. GPT?)


# How does flask-migrate work?
## To update your database
* Don't "Delete pData"
* Instead run: docker compose exec web flask --app 'twidilers:create_app()' db upgrade
## When modifying the db models
* Don't just edit the models then try to upgrade. You need a migration script.
* To generate a migration script: docker compose exec web flask --app 'twidilers:create_app()' db migrate -m "Migration Message Here"
* THEN upgrade your db

# Cool general feature stuffs
* reCAPTCHA?


# Refactor
## Settings
* Redo settings into different templates



## User accounts
### New user setup process
* User 404 page when not fully setup
* Ability to resend verification link
### Login process
* Forgot password functionality
* "Stay signed in" button. Otherwise, automatically sign out after a week.
* Able to log in with either username or email
### Oauth feature requests
* passkeys?
### User API
* User-side API which allows users to post from outside of Twidilers.com (Would be cool to get some bots setup to make it look like there is activity)


## Moderation tools
Ability for admin03 to ban/delete user accounts


## Email requirements
### Styling/frontend changes
* All ready! Under /templates/email/
### When we'd send emails
* When changing user settings (like a password, email address)
* When creating an account
* Signing in from a new device (opt-in by user)
* Notification digest (Set up by user)
* Newsletter (opt-in by user)
### required enviromental variables
* FLASK_SECRET_KEY (is auto-generated if not present, but create if you want session persistence)
* FLASK_MAIL_SERVER (for which mail server to send messages from)
* FLASK_MAIL_USERNAME (the username to log into the mail server)
* FLASK_MAIL_PASSWORD (the password for that user)
* FLASK_MAIL_DEFAULT_SENDER (what address to send messages from, e.g. 'noreply@twidilers.com')


## Far out features
* Passkeys to store login information
* Search function
* Algorithmic feed that prefers newer posts by people you follow/interact with
    * Newness weight
    * Weight for the poster (Have you interacted with their posts recently (negetively or positively), do you follow them)