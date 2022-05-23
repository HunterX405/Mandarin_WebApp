FRONT END:

FONTS
HEADER - font-family: 'Dosis', sans-serif;
SUBHEADER -  font-family: 'Inter', sans-serif;

COLOR PALLETE
PINK: #f1787c;
CREAM: #eae8e1;
PASTEL GREEN: #7ea5a4; 


If CSS code not reflecting on website, do this:
When you refresh to see the css use control+f5 so you do cache-refresh.

Mandarin E-Learning Deployment

index must be a php file if using php (index.php)
create a composer.json with name, description, license, and all required libraries (php, jQuery, jQuery UI)

run 'composer validate' to validate composer.json
run 'compose update' to initialize composer
run 'git rm -r --cached vendor/' to remove vendor folder (not needed in heroku)
add '/vendor/' to .gitignore 
publish code using git/github

add new app in heroku
run git:remote code from heroku app "heroku git:remote -a mandarin-e-learning"
run 'git push heroku master' (run this again to update site when updating code);

open app in heroku

Done!
