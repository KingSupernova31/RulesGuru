"use strict";

const cron = require("node-cron"),
			fs = require("fs"),
			handleError = require("./handleError.js");

//Every day:
cron.schedule("0 0 1 * * *", function() {
	try {
		//backups
		fs.createReadStream('questionDatabase.db').pipe(fs.createWriteStream(`backups/questionDatabase/questionDatabase-${Date.now()}.db`));

		fs.createReadStream('logs/questionCountLog.json').pipe(fs.createWriteStream(`backups/questionCount/questionCount-${Date.now()}.json`));

		fs.createReadStream('logs/questionRequestLog.json').pipe(fs.createWriteStream(`backups/questionRequest/questionRequest-${Date.now()}.json`));

		fs.createReadStream('logs/searchLinkLog.json').pipe(fs.createWriteStream(`backups/searchLink/searchLink-${Date.now()}.json`));

		fs.createReadStream('logs/searchLinkLog.json').pipe(fs.createWriteStream(`backups/api/api-${Date.now()}.json`));
	} catch (err) {
		handleError(err)
	}
});
