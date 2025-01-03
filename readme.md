# Useful links
## Dependencies
Want to learn more about one of the dependencies we use? Look no further!
* Turbo.js https://turbo.hotwired.dev/handbook/
* Flask https://flask.palletsprojects.com/en/stable/

## Good tutorial sources
* https://blog.miguelgrinberg.com/category/Flask



# Bugs
* new-user.html throws a "Method Not Allowed. The method is not allowed for the requested URL." when trying to submit a profile piture or while changing the display name
* The default state is "following" for users. When you start out, you are following everyone


# Do before deployment:
* Fix bugs
* finish backend for hosting
* Email integration (See below)


# New feature wishlist
## General features
* Notifications
* Email
* Blogs


## Frontend changes
* Mobile version
* Improved loading times
* Accessibility for people with screen readers
* Updated flash styling


## User accounts
### New user setup process
* Add more pages
* bugs (You can't submit anything)
### Login process
* show password button
* When logging in with an old invalid password, flash "The password was changed recently"
* Forgot password functionality
* "Stay signed in" button. Otherwise, automatically sign out after a week.
* Sign in with Google button
### Sign up process
* Require unique email account
* Sign up with Google button (also verifies the acocunt)
* Show password button


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
    * Visability settings for posts and profile page (Set to followers only, trusted accounts, or public)
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


## Email requirements
### Styling/frontend changes
* All ready! Under /templates/email/
### User account creation changes
* Create account in "unverified" state until email link is clicked
    * see miguelgrinberg for useful secure email link generator
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