# Bugs
* It flashes "No File Selected" when trying to change display name
* It should flash "No content" when trynig to post without content (not letting you do it), with an "Are you sure?" prompt when posting without a title (titles are potional)


# HIGH PRIORITY
* Make Settings page fully functional
* Fix bugs
* finish backend for hosting
* Email integration


# New feature wishlist

## General features
* Notifications of mentions, replies to posts, etc
* Email functionality
* 404 page
* Compress images to a smaller resolution when displaying profile pictures


## Profile page
* Metadata about user such as
    * Posts made
    * Date joined
* Followers
    * See who they follow and who follows them in a seperate page


## Settings page
* Expanded submenus
    * Account Details
        * User accounts should not accept emojis
    * Security
        * change email associated with account
        * Option to require email confirmation when logging in on a new device
        * see login history
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
* Hashtags for posts
* Image upload for blogs/posts
* Different feed for people you follow


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
Finish twidilers hub website
Finish docker and docker compose
Fix gap in flashes
Capitalize flashes



# Frontend change wishlist
* Updated flashes
* Mobile version
* better light mode