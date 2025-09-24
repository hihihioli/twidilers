## user_api documentation

### /api/feed/<feedtype>/<page>
Feedtype can be all, following, or liked. Pagination is 15 posts per page. This serves feed.js and provides the page's 15 posts and standard information about each
### /api/user/<username>
Information about a user. Gives:
- id
- username
- displayname
- photo url
- is email-verified?
- is setup?
- is oauth?
- userdata (JSON)
- link to profile
### /api/users/all
Same as /api/users/<username> but for all users
### /api/currentuser
If JS needs to find the current user (as in feed.js) it quieries this which gives the username and user id
### /api/post/<post_id>
Returns information about a specific post
### /api/users/bulk
Data lookup with all users' usernames, displaynames, photo urls, and links to profile
### /api/post/<post_id>/like
POST request from feed.js to toggle liking a post
### /api/post/<post_id>
DELETE request for a post that deletes specific post
### /api/user/<username>/pfp
Gets user profile picture.