# RulesGuru
The source code for [RulesGuru](http://rulesguru.org/), a resource for Magic judges and rules-oriented players.

If you have a bug report or feature request, feel free to open an issue or comment on an existing one. However, pull requests will only be accepted if you're a member of the RulesGuru project. See [here](https://rulesguru.org/get-involved) for more information.

Wizards of the Coast is constantly releasing more cards, often with new layouts and characteristics that we want to support as soon as possible. Everything must thus be designed with future compatibility and maintainability in mind.

## Setup
To run a local version of RulesGuru, you'll need [Node.js](https://nodejs.org/en/) 24 or greater along with its package manager npm. Download the files with `git clone https://github.com/KingSupernova31/RulesGuru`, enter the directory with `cd RulesGuru`, and then run `npm ci` to install the required node modules. Next, download and generate RulesGuru's data files with `node custom_modules/updateDataFiles.js`. (This has to download card data and may take several minutes.) You can then run all scripts with `npm start` and `npm stop`, or run only the webserver with `node server.js`. (The server will take a few minutes to start the first time.) Access the local website at `http://localhost:8080`.

Certain files in this repository contain placeholder data as detailed below:

* `externalCredentials.json` does not contain real credentials, and your local application will encounter an error if it tries to use them. If you want to test any of the external API functionality, you'll need to supply your own credentials.
* `admins.json` contains data for a single test admin with owner permissions. If you want admins with different permissions, start the server as described above, navigate to `localhost:8080/question-editor`, log in to the owner account with password `correcthorsebatterystaple`, and use the admin editor to add the desired accounts.
* `questionDatabase.db`, `recentlyDistributedQuestionIds.json`, `public_html/globalResources/searchLinkMappings.js`, `public_html/searchLinkCardNamesDiff.js`, `public_html/globalResources/allTags.js`, and everything in the `logs/` directory are updated automatically. As such, the files in this repository are outdated versions of the live files. This may occasionally result in errors due to data mismatches when run locally. If this happens, let me know and I'll upload a newer version of them. They'll also change automatically on your local copy, so you may want to add them to your .gitignore locally.
* The API that RulesGuru uses to fetch metagame data is private and will get blocked by Cloudflare if any other IP address tries to access it, so for development purposes we host a mirror of that data ourselves at the URLs in `mostPlayedApiUrls.json`.