# run this when deploy to heroku
package might not be installed
`heroku config:set NPM_CONFIG_PRODUCTION=false`


# check log heroku 
`heroku logs --tail`

# combine git add & git commit -m 
`git config --global alias.add-commit '!git add -A && git commit -m'`
then run `git add-commit 'commit message'`