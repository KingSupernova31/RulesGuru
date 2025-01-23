"use strict";

const fs = require("fs"),
			handleError = require("./handleError.js");

const makeDirIfNeeded = function(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

try {

	makeDirIfNeeded("backups");
	makeDirIfNeeded("backups/api");
	makeDirIfNeeded("backups/questionCount");
	makeDirIfNeeded("backups/questionDatabase");
	makeDirIfNeeded("backups/questionRequest");
	makeDirIfNeeded("backups/searchLink");

	fs.createReadStream('questionDatabase.db').pipe(fs.createWriteStream(`backups/questionDatabase/questionDatabase-${Date.now()}.db`));
	fs.createReadStream('logs/questionCountLog.jsonl').pipe(fs.createWriteStream(`backups/questionCount/questionCount-${Date.now()}.jsonl`));
	fs.createReadStream('logs/questionRequestLog.jsonl').pipe(fs.createWriteStream(`backups/questionRequest/questionRequest-${Date.now()}.jsonl`));
	fs.createReadStream('logs/searchLinkLog.jsonl').pipe(fs.createWriteStream(`backups/searchLink/searchLink-${Date.now()}.jsonl`));
	fs.createReadStream('logs/apiLog.jsonl').pipe(fs.createWriteStream(`backups/api/api-${Date.now()}.jsonl`));
} catch (err) {
	handleError(err)
}
