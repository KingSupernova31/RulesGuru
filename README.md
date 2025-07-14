# RulesGuru
[RulesGuru](http://rulesguru.org/) is a database of Magic: The Gathering rules questions. It supports procedual generation of question variations, searching by complex criteria, an API for building your own features on top of our question pool, and a user-friendly UI for Magic judges and players who wish to use it as a study resource.


## Setup
To run a local version of RulesGuru, you'll need [Node.js](https://nodejs.org/en/) 24 or greater along with its package manager npm.

1. `git clone https://github.com/KingSupernova31/RulesGuru` to download the files.
2. `cd RulesGuru` to enter the directory.
3. `npm ci` to install the required dependencies.
4. `node custom_modules/updateDataFiles.js` to download and generate RulesGuru's data files. This may take several minutes.
5. `node server.js` to start the webserver.
6. Navigate to `http://localhost:8080` in your browser to view the site.

You can also use `npm start` and `npm stop` to run the entire environment including scheduled background tasks and auxilliary programs, but for 99% of development you won't need those.

The server will create dummy data files to make your development environment function correctly. There are still a few differences between these and the production files however:

* The server creates one admin account with owner permissions and a fake email address. If you want to edit this account or add other admins with different permissions, start the server, navigate to `localhost:8080/question-editor`, log in to the owner account with password `correcthorsebatterystaple`, and use the admin editor in the top left to add the desired accounts.
* All credentials in `privateData.json` will be blank. To use the email, discord bot, or other private functionality, you'll need to provide your own credentials.
* `questions.db` will contain one placeholder question at ID=1. (The live database has around 7000 rows currently.) You can view and modify this question, or add new ones, on your [local question editor](localhost:8080/question-editor).
* `public_html/globalResources/searchLinkMappings.js` and `public_html/searchLinkCardNamesDiff.js` are generated to be backwards-compatible with previous versions of themselves, so the live versions will be slightly different from ones that get created from scratch.

## Development guidelines

* Wizards is constantly coming out with new cards, layouts, mechanics, formats, oracle text, and more. All RulesGuru features should be designed with future compatibility and maintainability in mind. Categorization systems should be broad and easily-extensible. Systems should automatically check for changes from upstream data sources and update RulesGuru's data accordingly. Any part of the code that interfaces with such data should have automated checks for data that falls outside of the supported bounds, and send out an admin warning email if this is detected.

* The `data_files` and `public_data_files` directories are *only* for files that are automatically generated; i.e. ones that can be deleted without causing an error. (Though doing so might lose important production data, like the question database or the admin accounts.) Hardcoded data files should be placed elsewhere.

* I made this project as a way to teach myself programming, so you will come across a number of ideosyncratic or downright bad choices in the codebase. Feel free to fix these as you come across them, and I would also love to hear general feedback on how I should improve my programming style and general archetecture. However I would prefer to avoid doing large refactors unless they're needed for some relevant feature; I think RulesGuru is too small a project for that to be worth the time.

* Most user-facing features should be documented on the About page, and editor features on the Admin Info page.

* Several issues in this Github repo all relate to the same conceptual systems on RulesGuru. For efficiency, before embarking on one issue, check related issues and see if you can address them all at once.

* There are a few issues that can't be done with the code on Github and need access to the VPS, email, or other auxiliary services. Just leave those ones to me, it's not worth the effort of setting up ways for others to access those services.

* Some issues, mostly those with the "discussion wanted" label, are tentative ideas with a lot of subjectivity. For those, come up with a proposal on how you think it should work, and talk it over with me before you start working on it.

* Several organizations have generously given us grants for development work. As such, we can sometimes afford to pay for contributions. Talk to me for the details at any given time. I can be contacted via [email](is.aack@yahoo.com) or in the RulesGuru [Discord server](https://discord.gg/HbBXSe7nf5).


## Third-party usage

RulesGuru is [source-available software](https://en.wikipedia.org/wiki/Source-available_software). In general, anyone is welcome to use the code here for personal projects, but we have exceptions for AI training and a few other things. See our license for details.