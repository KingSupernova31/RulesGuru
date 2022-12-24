"use strict";

//"700" will change all 700 rule citations to 701, 701 to 702, etc up to the end of the section. "700.1" will change 700.1 to 700.2, etc. You can probably guess what "700.1a" does. Type the rule that got added.
const startingRuleToUpdate = "719";

//Returns the next letter of the alphabet, skipping "l" and "o".
const nextLetter = function(letter) {
	if (letter.length === 1) {
		return "abcdefghijkmnpqrstuvwxyz"["abcdefghijkmnpqrstuvwxyz".indexOf(letter) + 1];
	} else {
		console.log(`"${letter}" is not a single letter.`)
	}
}

const letterAIsBeforeLetterB = function(letterA, letterB) {
	return "abcdefghijkmnpqrstuvwxyz".indexOf(letterA) < "abcdefghijkmnpqrstuvwxyz".indexOf(letterB);
}

//Updates all rules citations in the given string.
const updateString = function(stringToUpdate) {
	if (startingRuleToUpdate.length === 3) {
		stringToUpdate = stringToUpdate.replace(/\[(\d{3}(\.\d{1,3}([a-z])?)?)\]/g, function(match) {
			return match.replace(/(?<=\[)\d{3}/, function(subMatch) {
				if (subMatch[0] === startingRuleToUpdate[0] && Number(subMatch) >= Number(startingRuleToUpdate)) {
					return Number(subMatch) + 1;
				} else {
					return subMatch;
				}
			});
		});
	} else if (/\d/.test(startingRuleToUpdate.slice(-1))) {
		stringToUpdate = stringToUpdate.replace(/\[(\d{3}(\.\d{1,3}([a-z])?)?)\]/g, function(match) {
			return match.replace(/(?<=\[\d{3}\.)\d{1,3}/, function(subMatch) {
				if (match.slice(1, 4) === startingRuleToUpdate.slice(0, 3) && Number(subMatch) >= Number(startingRuleToUpdate.slice(4))) {
					return Number(subMatch) + 1;
				} else {
					return subMatch;
				}
			});
		});
	} else if (/[a-z]/.test(startingRuleToUpdate.slice(-1))) {
		stringToUpdate = stringToUpdate.replace(/\[(\d{3}(\.\d{1,3}([a-z])?)?)\]/g, function(match) {
			return match.replace(/(?<=\[\d{3}\.\d{1,3})[a-z]/g, function(subMatch) {
				if (match.slice(1, -2) === startingRuleToUpdate.slice(0, -1) && !letterAIsBeforeLetterB(subMatch, startingRuleToUpdate.slice(-1))) {
					return nextLetter(subMatch);
				} else {
					return subMatch;
				}
			});
		});
	} else {
		console.log("Invalid startingRuleToUpdate");
		return;
	}
	return stringToUpdate;
}




const fs = require("fs"),
	sqlite = require("sqlite3").verbose();

var db = new sqlite.Database("questionDatabase.db", function(err) {
	if (err) {
		console.log(err);
	}
});

let maxId;

db.all(`SELECT MAX("id") FROM questions`, function(err, result) {
	if (err) {
		console.log(err);
	} else {
		maxId = (result[0]['MAX("id")'] || 0);

		db.all("SELECT json FROM questions", [], function(err, result) {
			if (err) {
				console.log(err);
			} else {
				result.forEach(function(currentValue, index){
					result[index] = JSON.parse(currentValue.json);
				});

				for (let i in result) {
					const oldQuestion = result[i].question;
					const oldAnswer = result[i].answer;
					result[i].question = updateString(result[i].question);
					result[i].answer = updateString(result[i].answer);

					if (oldQuestion !== result[i].question || oldAnswer !== result[i].answer) {
						db.run(`UPDATE questions SET json = '${JSON.stringify(result[i]).replace(/'/g,"''")}' WHERE id = ${result[i].id}`, function(err) {
							if (err) {
								console.log(err);
							} else {
								console.log(`Updated question ${result[i].id}`);
							}
						});
					}
				}
			}
		});
	}
});
