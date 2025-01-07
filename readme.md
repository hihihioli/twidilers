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
* typeError occures when changing the password of a github account
* Notifications
    * Can't clear
    * Only one per person(Maybe one overall)
* bio styling in new-user
* new-user, when submitting pfp but not choosing a file, you get a 'unsupported file type'. you can't go back to the previus step
* Account isn't actually verified after going through verification setup
* Trying to sign in with google and requests.exceptions.ConnectionError: HTTPSConnectionPool(host='www.googleapis.com', port=443): Max retries exceeded with url: /oauth2/v3/userinfo (Caused by NewConnectionError('<urllib3.connection.HTTPSConnection object at 0x7f9ad29dd6d0>: Failed to establish a new connection: [Errno 101] Network is unreachable'))


# Do before deployment:
* Fix bugs 
* Email integration (DONE!)
* Mod tools (dashboard.html)
* Oauth
    * Set google oAuth to deployment (see above for link)
        * Change uri to twidilers.com
    * Change github oAuth uri to twidilers.com
* Forgot password button
    * Code can be generated and set as users verification code
* Support@twidilers.com + in footer


# New feature wishlist
## General features
* Blogs
* Use Flask-Login(backend)


## Frontend changes
* Mobile version
* Improved loading times
* Updated flash styling
* light mode


## User accounts
### New user setup process
* User 404 page when not fully setup
* Ability to resend verification link
### Login process
* Forgot password functionality
* "Stay signed in" button. Otherwise, automatically sign out after a week.
* Able to log in with either username or email
### Oauth feature requests


## Moderation tools
While it doesn't have to be advanced right now, we need to have the ability to ban users/IP addresses and delete offending posts (If someone posts something illegal, we would have to delete the whole database). Report system optional.


## User pages
### Profile page
* Followers
    * See who they follow and who follows them
### Settings page
* Account Details
* Security
    * change email associated with account
        * Sends verification code to old email, then to new email.
    * Option to require email confirmation when logging in on a new device (2FA)
    * see login history (Log logins on a file for the user)
    * changing pwd 
        * should require verification code sent to email account
        * Verify new password (Put it in twice like when signing up)
* Privacy
    * Visability settings for posts and profile page (Set to followers or public)
* Notifications
    * Which notifications are sent to email
    * Change what things to be notified on


## Feed
* Reactions (reply, like/dislike) on posts
* Mention users via username. Sends notification
### Regular posts
* 
### Blogs
* notifications for blog posts
* Titles on blogs only
* Image upload
* HTML for blogs (but safe)


## Verification codes
* JWT / JWE for security (DONE)


## Email requirements
### Styling/frontend changes
* All ready! Under /templates/email/
### User account creation changes
* Ability to resend verification link
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

Blogging system
Chat room
Fix gap in flashes
Capitalize flashes