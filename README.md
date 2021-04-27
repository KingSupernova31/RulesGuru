# RulesGuru
The source code for [RulesGuru](http://rulesguru.net/), a resource for Magic judges.

If you have a bug report or feature request, feel free to open an issue or comment on an existing one. However, pull requests will only be accepted if you're a member of the RulesGuru project. See [here](https://rulesguru.net/get-involved) for more information.

Wizards of the Coast is constantly releasing more cards, often with new layouts and abilities. Scalability and versatility are therefore a high priority for new features, and code should keep future maintainability in mind.

To run a local version of RulesGuru, you'll need [Node.js](https://nodejs.org/en/). Download the files from this repository and run `npm install` in that directory to install the required node modules. Then download and generate RulesGuru's data files with `node updateDataFiles.js`. (This usually takes several minutes.) You can then start all scripts running with `pm2 start ecosystem.config.js` or run only the server with `node server.js`. (Note that the server takes around 30 seconds to start.)

Certain files in this repository contain placeholder data as detailed below:

* `emailCredentials.json` and `discordPassword.txt` do not contain real passwords, and your local application will encounter an error if it tries to use them. If you want to use that functionality, you'll need to supply your own email and/or Discord credentials.
* `admins.json` contains data for a single test admin. If you need admins with different permissions, start the server as described above, then navigate to `localhost:8080/question-editor`, log in to the owner account with password `correcthorsebatterystaple`, and use the admin editor to add/edit the desired admin accounts.
* `questionDatabase.db`, `public_html/globalResources/searchLinkMappings.js`, and `public_html/searchLinkCardNamesDiff.js`, are older version of the ones in use on the live RulesGuru site. This may occasionally result in errors due to data mismatches when run locally. If this happens to you, let me know I'll upload a newer version of them.
* The API that RulesGuru uses to fetch metagame data is private, so for development purposes we host a mirror of that data ourselves at the URLs in `mostPlayedApiUrls.json`. Please do not use this data for any other purpose.
* `logs/` and `backups/` are also (obviously) not up-to-date.
* `savedAnnouncements.js` has a placeholder announcement.
