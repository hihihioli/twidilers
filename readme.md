# Bugs
* It flashes "No File Selected" when trying to change display name
* It should flash "No content" when trynig to post without content (not letting you do it), with an "Are you sure?" prompt when posting without a title (titles are potional)

# New feature wishlist
## Profile page
* Metadata about user such as
    * Posts made
    * Date joined

## Settings page
* Expanded submenus
    * Account Details
        * User accounts should not accept emojis
    * Security
        * change email associated with account
        * see login history
    * Privacy
        * make it possible to make your account page private
        * Change visability of posts to just people you follow
        * option to force poeple to request to follow you

## Feed
* Reactions (reply, like/dislike) on posts
* Blog posts (posts you can click on, segregated from main feed)
    * Blog posts would accept raw HTML
* removal of titles (except for blog posts)
* Algorithmic feed that prefers newer posts by people you follow/interact with
    * Newness weight would be this: y=-0.2x^{4}+1 where x=time and y=weight (to be tweaked)
    * Weight for the poster (Have you interacted with their posts recently (negetively or positively), do you follow them)

## Login page
* show password button
* Require unique password (not the same as your username)

## nice to haves
* tags for posts
* ability to have line breaks in posts
* 404 page working

# Major to-dos before launch
Blogging system
User page
Chat room
Finish twidilers hub website
Finish docker and docker compose
Fix gap in flashes
Capitalize flashes


# Frontend change wishlist
* Updated flashes
* login page--make it look better
* Mobile version
* better light mode