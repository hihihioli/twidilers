Here's a brief overview of the files and what they do as of 1/2/25

Many of these functions are similar because I just made them to show different divs.


# base.js
This here is kind of a special case. It's expanded flyout.js because there are two flyouts. Normally, this wouldn't be an issue, but because there are two popup menus that overlap, both of them need to be hidden. I didn't feel like putting this in flyout.js so gave it it's own file

# fontawesome.js
Basic script called at the end of base.html that loads fontawesome.css only once the page is fully loaded. Fontawesome.css can slow the page load times by up to 10x. Deferred calling helps mitigate it but a longer term solution would be to just load svgs of fontawesome icons.

# flyout.js
It's a function called flyOut with the inputs being the flyout and the flyout button. It listens for a button click and then shows the flyout. This is useful for things like filters or something that doesn't warrent it's own page but also can't be shown all the time.

# settings.js
## Pagination
While flyout.js and base.js were for flyout menus, settings.js is mainly for pagination. Because the page is light enough we can load it all at once, it's not proceduraly loaded as you click on page buttons.
### Array
Using an array, we index the buttons and the settings divs. We then hide all divs except for the first one (account details) and normalize font weights except for the first one (because it's selected with account details)
### newPage
Then, newPage() is defined. This would be called from one of the buttons. The variable i is set as the index of the new page.

The code hides all pages, bolds the index for the new page, and shows the new page.

## Other stuff
There's other stuff in settings.js that isn't worth describing but worth mentioning. 

There is checkDelete() which confirms with the user that they want to delete their account. If yes, it submits the delete form.

I don't know why but it also submits the image when uploading a profile picture. This may be because we hide the usual submit button.

# welcome.js
This page is used for the new user welcome wizard. It has similar behavior to settings.js except it redirects if it is the last page.

There are some other things here too which mainly handle similar functions to settings.js (because it's basically just reskinned settings ngl) and the goAway() function which just hides the element

goAway() is useful for when you submit something but don't want to move onto the next step so you hide the current form.