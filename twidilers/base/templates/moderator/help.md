This document is for Oliver and Derin to see what dashboard.html needs to call.

# User posts
It pulls all posts like in feed.html. The admin can delete the post, mark the post as good, or ban the poster within each post
* For post in posts calls all posts
## for post in posts
* post.title
* post.author
* post.content
## Buttons
* Delete post (name="delete" value="{{ post.id }})
* Mark good which hides post from admin feed (name="markgood" value="{{ post.id }}")
* Ban poster ("name=banuser" value="{{ post.author }}")

# User accounts
Pulls all users as though they were posts. It calls for the username and email
## for user in users 
* user.username
* user.displayname
## Buttons
* Ban