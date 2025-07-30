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
* `questions.db` will contain one placeholder question at ID=1. (The live database has around 7000 rows currently.) You can view and modify this question, or add new ones, on [your local question editor](http://localhost:8080/question-editor).
* `public_html/globalResources/searchLinkMappings.js` and `public_html/searchLinkCardNamesDiff.js` are generated to be backwards-compatible with previous versions of themselves, so the live versions will be slightly different from ones that get created from scratch.

## Development guidelines

* We love contributions! Feel free to leave a comment and start working on any issue that interests you. (Avoid any issue that someone else is already assigned to.) This is mostly a volunteer/nonprofit project, but we sometimes get grants from various Magic-related organizations, which allow me to pay for more in-depth development work. Talk to me for the details; I can be contacted via [email](is.aack@yahoo.com) or in the RulesGuru [Discord server](https://discord.gg/HbBXSe7nf5). If you want to help out consistently I'm also happy to add you on Github as a collaberator.

* Several of the issues on this repo were written back when it was just me on the project, so they're less "description" and more "cryptic hints that assume you know everything I do". If you have questions about what something actually means, please don't hesitate to ask and I'll rewrite the description so it actually explains what needs doing.

* I originally made this project as my "learn to program" project, so you will likely come across a number of ideosyncratic or downright bad choices in the codebase. Please don't hesistate to mention them, I won't be offended and will appreciate suggestions as to better approaches. You're also welcome to fix them yourself.

* Some basic documentation of RulesGuru's features is on the [About](http://localhost:8080/about) page, and more specialized information can be found on the [API](http://localhost:8080/api/documentation/) and [admin](http://localhost:8080/admin-information/) documentation pages. You'll likely want to refer to those while getting started, and any functional changes you make should be reflected there for users.

* Wizards is constantly coming out with new cards, layouts, mechanics, formats, oracle text, and more. All RulesGuru features should be designed with future compatibility and maintainability in mind. Categorization systems should be broad and easily-extensible. Systems should automatically check for changes from upstream data sources and update RulesGuru's data accordingly. Any part of the code that interfaces with such data should have automated checks for data that falls outside of the supported bounds, and send out an owner warning email if this is detected. Etc.

* The `data_files` and `public_data_files` directories are *only* for files that are automatically generated; i.e. ones that can be deleted without causing an error. (Though doing so might lose important production data, like the question database or the admin accounts.) Hardcoded data files should be placed elsewhere.

* If it matters for the issue you're working on, our hosting solution is basically a clone of this repo on a small Ubuntu DigitalOcean VPS. (1 CPU, 1GB memory + 5GB swap, and another ~10GB of free disk space, so keep things reasonably efficient.) Nginx reverse-proxies the local port out to the internet and certbot handles https, but other than that pretty much all information about the live site is reflected in this repo.


## Third-party usage

RulesGuru is [source-available software](https://en.wikipedia.org/wiki/Source-available_software). In general, anyone is welcome to use the code here for personal projects, but not for AI training or anything commercial. See our license for details.