# RulesGuru
[RulesGuru](http://rulesguru.org/) is a database of rules questions for Magic judges and rules-oriented players.

If you have a bug report or feature request, feel free to open an issue or comment on an existing one. Pull requests will only be accepted if you're a member of the RulesGuru project. See [here](https://rulesguru.org/get-involved) for more information.


## Setup
To run a local version of RulesGuru, you'll need [Node.js](https://nodejs.org/en/) 24 or greater along with its package manager npm. Download the files with `git clone https://github.com/KingSupernova31/RulesGuru`, enter the directory with `cd RulesGuru`, and then run `npm ci` to install the required node modules. Next, download and generate RulesGuru's data files with `node custom_modules/updateDataFiles.js`. (This has to download card data and may take several minutes.) You can then run all scripts with `npm start` and `npm stop`, or run only the webserver with `node server.js`. (The server will take a few minutes to start the first time.) Access the local website at `http://localhost:8080`.

Certain files in this repository contain placeholder data as detailed below:

* `externalCredentials.json` does not contain real credentials, and your local application will encounter an error if it tries to use them. If you want to test any of the external API functionality, you'll need to supply your own credentials.
* `admins.json` contains data for a single test admin with owner permissions. If you want admins with different permissions, start the server as described above, navigate to `localhost:8080/question-editor`, log in to the owner account with password `correcthorsebatterystaple`, and use the admin editor to add the desired accounts.
* `questionDatabase.db`, `recentlyDistributedQuestionIds.json`, `public_html/globalResources/searchLinkMappings.js`, `public_html/searchLinkCardNamesDiff.js`, `public_html/globalResources/allTags.js`, and everything in the `logs/` directory are updated automatically. As such, the files in this repository are outdated versions of the live files. This may occasionally result in errors due to data mismatches when run locally. If this happens, let me know and I'll upload a newer version of them. They'll also change automatically on your local copy, so you may want to add them to your .gitignore locally.
* The API that RulesGuru uses to fetch metagame data is private and will get blocked by Cloudflare if any other IP address tries to access it, so for development purposes we host a mirror of that data ourselves at the URLs in `mostPlayedApiUrls.json`.


##Development guidelines

* Wizards is constantly coming out with new cards, layouts, mechanics, formats, changing oracle text, and more. All RulesGuru features should be designed with future compatibility and maintainabilityis in mind. Cetegorization systems should be broad and easily-extensible. Systems should automatically check for changes from upstream data sources and update RulesGuru's data accordingly. Any part of the code that interfaces with such data should be automated checks for data that falls outside of the supported bounds, and send out an admin warning email if this is detected.

* This is a small project maintained by a small number of people without many resources. As such, try to keep the focus on user-relevant features; of course if you see bad code, fix it, but try to avoid endless refactoring, tests, fancy new frameworks, and other stuff that might be important on a larger project but is really not necessary for RulesGuru.

* Several issues in this Github repo all relate to the same conceptual systems on RulesGuru. For efficiency, before embarking on one issue, check related issues and see if you can address them all at once.

* Any time you edit a user-facing feature, if it's important enough, please remember to add it to the About page. Similarly, for editor-facing features, add them to the admin info documentation page.

* There are a few issues that can't be done with the code on Github and need access to the VPS, email, or other auxiliary services. Just leave those ones to me, it's not worth the effort of setting up ways for others to access those services.

* Some issues, mostly those with the "discussion wanted" label, are tentative ideas with a lot of subjectivity. For those, come up with a proposal on how you think it should work, and talk it over with me before you start working on it.

* All contributors to RulesGuru must agree to cede the intellectual property rights to their contributions. Please fill out [this](https://docs.google.com/forms/d/1vsJQ7-JZw098DLBAot4UJVkQX8Egf599DjlGcAu_hyw/edit) form to do so.

* Several organizations have generously given us grants for development work. As such, we can sometimes afford to pay for contributions. Talk to me for the details at any given time.


## Third-party usage

RulesGuru is [source-available software](https://en.wikipedia.org/wiki/Source-available_software). In general, anyone is welcome to use the code here for personal projects, particularly those that benefit the Magic and Magic Judging communities. I retain all rights to this code and may ask you to stop using it if you're doing something I don't like. In particular, you may not use any RulesGuru code or data for AI training without my explicit prior approval.