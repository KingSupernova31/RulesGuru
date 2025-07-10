"use strict";

const	fs = require("fs"),
	sqlite = require("sqlite3").verbose();

let questionArr = [];

const db = new sqlite.Database("./data_files/questions.db", function(err) {});

Object.defineProperty(Array.prototype, "caseInsensitiveIncludes", {
	"value": function(value) {
		for (let i = 0 ; i < this.length ; i++) {
			if (this[i].toLowerCase() === value.toLowerCase()) {
				return true;
			}
		}
		return false;
	}
});

db.serialize(function() {
	db.all(`SELECT * FROM questions`, [], function(err, result) {
		if (err) {
			console.log(err);
		} else {
			questionArr = result;
			questionArr.forEach(function(element, index) {
				questionArr[index].json = JSON.parse(element.json);
				questionArr[index].verification = JSON.parse(element.verification);
			});
			doSomethingFunction();
			questionArr.forEach(function(element) {
				db.run(`UPDATE questions SET json = '${JSON.stringify(element.json).replace(/'/g,"''")}', status = '${element.status}', verification = '${JSON.stringify(element.verification).replace(/'/g,"''")}' WHERE id = ${element.id}`, function(err) {
					if (err) {
						console.log(err);
					}
				});
			});
		}
	});
});

const allCards = JSON.parse(fs.readFileSync("./data_files/allCards.json", "utf8"));

const convertAllTemplates = function(questionObj, allCards) {
	const convertedQuestion = JSON.parse(JSON.stringify(questionObj.json))
	convertedQuestion.cardLists = [];
	for (let i = 0 ; i < convertedQuestion.cardGenerators.length ; i++) {
		if (typeof convertedQuestion.cardGenerators[i][0] === "object") {
			convertedQuestion.cardLists[i] = templateConvert(convertedQuestion.cardGenerators[i], allCards);
		} else {
			convertedQuestion.cardLists[i] = convertedQuestion.cardGenerators[i]
		}
	}
	delete convertedQuestion.cardGenerators;
	questionObj.json = convertedQuestion;
};

let total = 0;


const doSomethingFunction = function() {
	const allResults = {};
	questionArr.forEach(function(questionObj) {
		for (let generator of questionObj.json.cardGenerators) {
			if (typeof generator[0] === "string") {
				continue;
			}
			for (let rule of generator) {
				if (rule.orGroup !== null && rule.orGroup >= 100) {
					console.log(questionObj.json.id)
					console.log(rule.orGroup)
				}
			}
		}
	});
};
