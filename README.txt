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


BACK END:

    Deployment instruction:

        //Composer
        Create a composer.json file with name, description, license, and all required libraries (php, jQuery, jQuery UI)
        Run 'composer validate' to validate composer.json
        Run 'compose update' to initialize composer
        Run 'git rm -r --cached vendor/' to remove vendor folder (not needed in heroku)
        Add '/vendor/' to .gitignore
        Commit code to github using git

        //Heroku
        The index file must be .php(index.php) if using php so heroku could detect it's a php app
        Add new app in heroku account
        Run git:remote code from heroku app "heroku git:remote -a APP-NAME"
        Run 'git push heroku master' (run this again to update site after updating code/github);
        Open app in heroku account

        Done!
