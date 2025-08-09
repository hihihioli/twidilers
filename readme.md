# Useful links
## Dependencies
Want to learn more about one of the dependencies we use? Look no further!
* Flask https://flask.palletsprojects.com/en/stable/
* Google Oauth https://console.cloud.google.com/apis/credentials?authuser=6&project=twidilers&supportedpurview=project 
* Github Oauth https://github.com/settings/applications/2831103 

## Good tutorial sources
* https://blog.miguelgrinberg.com/category/Flask

# HOW BRANCHES WORK
Each feature or improvement you make should be made in the corresponding branch. After the branch feels mature and ready for review, make a pull request for that branch to go into beta-stable, where it is fully tested and then send to prod.

Hotfixes are send straight to beta-stable. They are fixes that are for non-working features currently in prod.

The README that should always be referenced is *THIS ONE*. Don't make one in a specific branch.

## Branches
If there isn't a category here for something, or you are planning a major revamp of something that spreads multiple features, consider making a new branch.
### General
For styling, landing page, about page, and other uncategorized pages
### Settings
Along with changes to the settings app, this includes user-customizable options (such as being able to toggle between light and dark mode) that are changed in the settings menu.
### User-interaction
Notifications, DMs, and the profile page would fall under this category








# Unfinished/broken features

## Feed
If you want to work on this, talk to Eamon because he needs some API help here!
### Reactions
We need to re-add in reaction functionality, with (optional) notifications when you get a reaction to your post. A count displayed in the feed.
### Filtering
Different feeds for "All", "Following", and "Liked". Would require a big overhaul of the API because every user would have their own feed API.

## Settings
### Flyout styling
I don't know how this would work but an option to switch between the different flyout styles
### Notifications
Yeah this is a blank page right now. Not technically "unfinished" but we need to add options here as we fully bring notifications into functionality

## Notifications
### Notification page
Barebones right now but could be decently better with cool animations and shit. Also could not exist if we don't want to push too hard into notifications

## DMs
If derin wants to work on this sure but i don't see this as high priority -Eamon


# Finished features not in prod
## Settings
* Improved button layout (PR 26)
* Better mobile functionality (PR 26)
* Dark/light mode toggle
* Camera functionality
## Notifications
* They work now



# Cool general feature stuffs

## Settings
* Redo settings into different templates
* Add notification settings
* Appearance preferances, changing the flyout style and default feed setting

## User accounts
### New user setup process
* User 404 page when not fully setup
* Ability to resend verification link
### Login process
* "Stay signed in" button. Otherwise, automatically sign out after a week.
* Able to log in with either username or email
### Oauth
* passkeys?
### User API
* User-side API which allows users to post from outside of Twidilers.com (Would be cool to get some bots setup to make it look like there is activity)

## Moderation tools
Ability for admin03 to ban/delete user accounts


# Email requirements
## When we'd send emails
* When changing user settings (like a password, email address)
* When creating an account
* Signing in from a new device (opt-in by user)
* Notification digest (Set up by user)
* Newsletter (opt-in by user)
## required enviromental variables
* FLASK_SECRET_KEY (is auto-generated if not present, but create if you want session persistence)
* FLASK_MAIL_SERVER (for which mail server to send messages from)
* FLASK_MAIL_USERNAME (the username to log into the mail server)
* FLASK_MAIL_PASSWORD (the password for that user)
* FLASK_MAIL_DEFAULT_SENDER (what address to send messages from, e.g. 'noreply@twidilers.com')

# How does flask-migrate work?
## To update your database
* Don't "Delete pData"
* Instead run: docker compose exec web flask --app 'twidilers:create_app()' db upgrade
## When modifying the db models
* Don't just edit the models then try to upgrade. You need a migration script.
* To generate a migration script: docker compose exec web flask --app 'twidilers:create_app()' db migrate -m "Migration Message Here"
* THEN upgrade your db

## Far out features
* Passkeys to store login information
* Search function
* Algorithmic feed that prefers newer posts by people you follow/interact with
    * Newness weight
    * Weight for the poster (Have you interacted with their posts recently (negetively or positively), do you follow them)
* Blocking feature. Example: Alice blocks Bob. Bob can't see Alice's posts.
* Hiding feature. Example: Alice hides Bob. Alice can't see Bob's posts anymore.