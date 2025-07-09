
# Do before deployment:
* Oauth
    * Set google oAuth to deployment (see above for link)
        * Change uri to twidilers.com
    * Change github oAuth uri to twidilers.com
* TOS and PP (legally probably required. GPT?)

# __POST-DEPLOYMENT SUMMARY__
## stage 1: initial deployment
It was pretty hard and many things went wrong, but it eventually worked.
Known issues so far:
* Emails not sending(not even registered by the smtp server)
    * Fixed
* OAuth doesn't work(something like mismatched uri)
    * not a problem anymore
* idk if the db even works, i can't log in because of the previous 2 issues
    * just checks i think it works, it remembered that i needed to verify
* The about us and everything else seems fine for now
* tell me(oliver) if anything else is broken or add it to this list