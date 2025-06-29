# RulesGuru
[RulesGuru](http://rulesguru.org/) is a database of rules questions for Magic judges and rules-oriented players.

If you have a bug report or feature request, feel free to open an issue or comment on an existing one. Pull requests will only be accepted if you're a member of the RulesGuru project. See [here](https://rulesguru.org/get-involved) for more information.


## Setup
To run a local version of RulesGuru, you'll need [Node.js](https://nodejs.org/en/) 24 or greater along with its package manager npm.

1. `git clone https://github.com/KingSupernova31/RulesGuru` to download the files.
2. `cd RulesGuru` to enter the directory.
3. `npm ci` to install the required dependencies.
4. `node custom_modules/updateDataFiles.js` to download and generate RulesGuru's data files. This may take several minutes.
5. `node server.js` to start the webserver. This also may take several minutes, but only the first time.
6. Navigate to `http://localhost:8080` in your browser to view the site.

You can also use `npm start` and `npm stop` to run the entire environment including scheduled background tasks and auxilliary programs, but for 99% of development you won't need those.

Certain files in this repository contain placeholder data as detailed below:

* `externalCredentials.json` does not contain real credentials, and your local application will encounter an error if it tries to use them. If you want to test any of the external API functionality, you'll need to supply your own credentials.
* `admins.json` contains data for a single test admin with owner permissions. If you want admins with different permissions, start the server as described above, navigate to `localhost:8080/question-editor`, log in to the owner account with password `correcthorsebatterystaple`, and use the admin editor in the top left to add the desired accounts.
* `questionDatabase.db` contains a random 10 questions as example data. The live database has around 7000 rows currently.
* `public_html/globalResources/searchLinkMappings.js`, `public_html/searchLinkCardNamesDiff.js`, and `public_html/globalResources/allTags.js`, are updated automatically. As such, the files in this repository are outdated versions of the live files. This may occasionally result in errors due to data mismatches when run locally. If this happens, let me know and I'll upload a newer version of them. They'll also change automatically on your local copy, so you may want to add them to your .gitignore locally.
* The API that RulesGuru uses to fetch metagame data is private and will get blocked by Cloudflare if any other IP address tries to access it, so for development purposes we host a mirror of that data ourselves at the URLs in `mostPlayedApiUrls.json`.


## Development guidelines

* Wizards is constantly coming out with new cards, layouts, mechanics, formats, oracle text, and more. All RulesGuru features should be designed with future compatibility and maintainability in mind. Categorization systems should be broad and easily-extensible. Systems should automatically check for changes from upstream data sources and update RulesGuru's data accordingly. Any part of the code that interfaces with such data should have automated checks for data that falls outside of the supported bounds, and send out an admin warning email if this is detected.

* I made this project as a way to teach myself programming, so you will come across a number of ideosyncratic or downright bad choices in the codebase. Feel free to fix these as you come across them, and I would also love to hear general feedback on how I should improve my programming style and general archetecture. However I would prefer to avoid doing large refactors unless they're needed for some relevant feature; I think RulesGuru is too small a project for that to be worth the time.

* Most user-facing features should be documented on the About page, and editor features on the Admin Info page.

* Several issues in this Github repo all relate to the same conceptual systems on RulesGuru. For efficiency, before embarking on one issue, check related issues and see if you can address them all at once.

* There are a few issues that can't be done with the code on Github and need access to the VPS, email, or other auxiliary services. Just leave those ones to me, it's not worth the effort of setting up ways for others to access those services.

* Some issues, mostly those with the "discussion wanted" label, are tentative ideas with a lot of subjectivity. For those, come up with a proposal on how you think it should work, and talk it over with me before you start working on it.

* Several organizations have generously given us grants for development work. As such, we can sometimes afford to pay for contributions. Talk to me for the details at any given time. I can be contacted via [email](is.aack@yahoo.com) or in the RulesGuru [Discord server](https://discord.gg/HbBXSe7nf5).


## Third-party usage

RulesGuru is [source-available software](https://en.wikipedia.org/wiki/Source-available_software). In general, anyone is welcome to use the code here for personal projects, but we have exceptions for AI training and a few other things. See our license for details.