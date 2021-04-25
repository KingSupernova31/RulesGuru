# RulesGuru
The source code for [RulesGuru](http://rulesguru.net/), a resource for Magic judges.

If you have a bug report or feature request, feel free to open an issue or comment on an existing one. However, pull requests will only be accepted if you're a member of the RulesGuru project. See [here](https://rulesguru.net/get-involved) for more information.

To run a local version of RulesGuru, you'll need to install [Node.js](https://nodejs.org/en/). Download all files from this repository and run `npm install` in that directory to install all the required node modules. You can then start all scripts running with `pm2 start ecosystem.config.js` or run only the server with `node server.js`.

Wizards of the Coast is constantly releasing more cards, often with new layouts or abilities. Scalability and versatility are therefore a high priority for any features. Pull requests should keep this in mind and try to be as future-proof as possible.
