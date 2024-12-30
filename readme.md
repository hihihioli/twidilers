# Useful links
## Dependencies
Want to learn more about one of the dependencies we use? Look no further!
* Turbo.js https://turbo.hotwired.dev/handbook/
* Flask https://flask.palletsprojects.com/en/stable/

## Good tutorial sources
* https://blog.miguelgrinberg.com/category/Flask



# Bugs
* You can visit profile page when not logged in


# HIGH PRIORITY
* Make Settings page fully functional
* Fix bugs
* finish backend for hosting
* Email integration
    * Style the html after you submit
    * Make sure email is unique
    * Create account in "unverified" state until email link is clicked
        * see miguelgrinberg for useful secure email link generator
    * Change email in settings
        * Verification from both old and new emails are required
    * When changing password, send an email to confirm the change
    * Ability to get daily/weekly digests of notifications


# New feature wishlist

## General features
* Followers
* Notifications
* Email
* API


## Profile page
* Followers
    * See who they follow and who follows them


## Settings page
* Expanded submenus
    * Account Details
        * User accounts should not accept emojis
    * Security
        * change email associated with account
        * Option to require email confirmation when logging in on a new device
        * see login history (Log logins on a file for the user)
        * changing pwd 
            * should require verification code sent to email account
            * Verify new password (Put it in twice like when signing up)
    * Privacy
        * make it possible to make your account page private
        * Change visability of posts to just people you follow
        * option to force poeple to request to follow you
    * Notifications
        * Which notifications are sent to email
        * Change what things to be notified on


## Feed
* Reactions (reply, like/dislike) on posts
* removal of titles (except for blog posts)
* Image upload for blogs
* Different feed just for people you follow


## Login page
* show password button
* When logging in with an old invalid password, flash "The password was changed recently"
* Forgot password functionality
* "Stay signed in" button. Otherwise, automatically sign out after a week.


## Signup page
* Require unique password (not the same as your username)
* Require email account (send verification code to confirm)


## Far out features
* Passkeys to store login information
* Search function
* Different feed modes, like "Following" "Everything" "Blogs" and "Recommended"
    * Algorithmic feed that prefers newer posts by people you follow/interact with
        * Newness weight
        * Weight for the poster (Have you interacted with their posts recently (negetively or positively), do you follow them)
    * Blog posts (posts you can click on, segregated from main feed)
        * Blog posts would accept raw HTML

Blogging system
Chat room
Fix gap in flashes
Capitalize flashes



# Frontend change wishlist
* Updated flashes
* Mobile version
* better light mode