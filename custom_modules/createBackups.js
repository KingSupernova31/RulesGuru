"use strict";

const fs = require("fs"),
	path = require("path"),
	handleError = require("./handleError.js");

const rootDir = path.join(__dirname, "..");

//Relative to RulesGuru root directory
const filesToBackUp = {
	"questionDatabase.db": "backups/questionDatabase",
	"logs/questionCountLog.jsonl": "backups/questionCount",
	"logs/questionRequestLog.jsonl": "backups/questionRequest",
	"logs/searchLinkLog.jsonl": "backups/searchLink",
	"logs/apiLog.jsonl": "backups/api",
};

const makeDirIfNeeded = function(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path, {recursive:true});
	}
};

for (let file in filesToBackUp) {
	const filePath = path.join(rootDir, file);
	const backupPath = path.join(rootDir, filesToBackUp[file]);
	makeDirIfNeeded(backupPath);
	const backupFilePath = path.join(backupPath, `${backupPath.substring(backupPath.lastIndexOf("/") + 1)}-${Date.now()}.${filePath.substring(filePath.lastIndexOf(".") + 1)}`);
	if (fs.existsSync(filePath)) {
		fs.createReadStream(filePath).pipe(fs.createWriteStream(backupFilePath));
	}
}