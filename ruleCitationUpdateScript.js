"use strict";

const { stringify } = require("querystring");

const citationRegex = /\(\[((\d{3})(?:\.(\d+)([a-km-np-z]+)?)?)\]\)/g;
const threeDigitRegex = /^\d\d\d$/;
const threeDigitWithDecimalRegex = /^\d\d\d\.\d+$/;
const threeDigitWithDecimalAndLettersRegex = /^\d\d\d\.\d+[a-kmnp-z]+$/;

const rulesHaveSameDepth = function (rule1, rule2) {
	//returns true if both rules are 3-digit integers
	if (rule1.match(threeDigitRegex) && rule2.match(threeDigitRegex)) {
		return true;
	}
	//returns true if both rules are 3-digit integers with a decimal point and an integer after it
	if (
		rule1.match(threeDigitWithDecimalRegex) &&
		rule2.match(threeDigitWithDecimalRegex)
	) {
		return true;
	}
	//returns true if both rules are 3-digit integers with a decimal point, an integer after it, and letters after that
	if (
		rule1.match(threeDigitWithDecimalAndLettersRegex) &&
		rule2.match(threeDigitWithDecimalAndLettersRegex)
	) {
		return true;
	}
	return false;
};

//function that returns true if both rules are on the same level of depth and the first rule is before the second rule
const ruleAIsBeforeRuleB = function (ruleA, ruleB) {
	if (rulesHaveSameDepth(ruleA, ruleB)) {
		if (ruleA.match(threeDigitRegex) && ruleB.match(threeDigitRegex)) {
			return ruleA[0] == ruleB[0] && Number(ruleA) < Number(ruleB);
		}
		if (
			ruleA.match(threeDigitWithDecimalRegex) &&
			ruleB.match(threeDigitWithDecimalRegex)
		) {
			return (
				ruleA.slice(0, 3) === ruleB.slice(0, 3) &&
				Number(ruleA.slice(4)) < Number(ruleB.slice(4))
			);
		}
		if (
			ruleA.match(threeDigitWithDecimalAndLettersRegex) &&
			ruleB.match(threeDigitWithDecimalAndLettersRegex)
		) {
			//if the 3-digit numbers at the beginning of the rules are the same
			if (ruleA.slice(0, 3) === ruleB.slice(0, 3)) {
				const letterIndexA = ruleA.indexOf(ruleA.match(/[a-kmnp-z]+$/)[0]);
				const letterIndexB = ruleB.indexOf(ruleB.match(/[a-kmnp-z]+$/)[0]);
				//if the numbers after the decimal point are the same
				if (
					letterIndexA == letterIndexB &&
					ruleA.slice(4, letterIndexA) === ruleB.slice(4, letterIndexB)
				) {
					const sliceA = ruleA.slice(letterIndexA);
					const sliceB = ruleB.slice(letterIndexB);
					if (sliceA.length > sliceB.length) {
						return false;
					}
					if (sliceA.length === sliceB.length) {
						return sliceA < sliceB;
					}
					//if sliceA's length is less than sliceB's length, return true
					return true;
				}
			}
		}
	}
	return false;
};

const nextRule = function (rule) {
	if (rule.match(threeDigitRegex)) {
		return (Number(rule) + 1).toString();
	}
	//if the rule number is a 3-digit integer with a decimal point and an integer after it
	if (rule.match(threeDigitWithDecimalRegex)) {
		return (rule.slice(0, 4) + (Number(rule.slice(4)) + 1)).toString();
	}
	if (rule.slice(-1) === "z") {
		return rule.slice(0, -1) + "aa";
	}
	//the rule letter can't be "l" or "o" because those are not letters.
	if (rule.match(/^\d\d\d\.\d+[kn]+$/)) {
		return (
			rule.slice(0, -1) +
			String.fromCharCode(rule.slice(-1)[0].charCodeAt(0) + 2)
		);
	}
	//prints the letter after rule.slice(-1)
	if (rule.match(/^\d\d\d\.\d+[a-jmp-y]+$/)) {
		return (
			rule.slice(0, -1) +
			String.fromCharCode(rule.slice(-1)[0].charCodeAt(0) + 1)
		);
	}
	//throw an error if the rule is not in the correct format
	throw new Error(`Invalid rule number: ${rule}`);
};

const previousRule = function (rule) {
	if (rule.match(threeDigitRegex)) {
		return (Number(rule) - 1).toString();
	}
	//if the rule number is a 3-digit integer with a decimal point and an integer after it
	if (rule.match(threeDigitWithDecimalRegex)) {
		return (rule.slice(0, 4) + (Number(rule.slice(4)) - 1)).toString();
	}
	if (rule.slice(-1) === "a") {
		return previousRule(rule.slice(0, -1)) + "z";
	}
	//the rule letter can't be "l" or "o" because those are not letters.
	if (rule.match(/^\d\d\d\.\d+[mp]+$/)) {
		return rule.slice(0, -1) + rule.slice(-1).previousLetter().previousLetter();
	}
	if (rule.match(/^\d\d\d\.\d+[b-knq-z]+$/)) {
		return rule.slice(0, -1) + rule.slice(-1).previousLetter();
	}
	//throw an error if the rule is not in the correct format
	throw new Error(`Invalid rule number: ${rule}`);
};

//function that increments all the question citations in the database that are greater than or equal to a specific rule number
const incrementQuestionCitations = function (ruleNumber) {
	//get all the questions from the database
	db.all("SELECT * FROM questions", function (err, rows) {
		console.log(rows);
		if (err) {
			console.log(err);
		} else {
			//create an empty list of ids to update
			let updatedRows = [];
			//loop through all the questions
			rows.forEach(function (row) {
				//find ALLLLLL the citations in the question and answer, not just the first one
				const matches = [...row.json.matchAll(citationRegex)];
				if (matches) {
					let rowJsonObject = JSON.parse(row.json);
					console.log(rowJsonObject);
				}
				for (var match of matches) {
					var matchedRuleNumber = match[1];
					if (
						matchedRuleNumber === ruleNumber ||
						ruleAIsBeforeRuleB(ruleNumber, matchedRuleNumber)
					) {
						console.log(row.id, matchedRuleNumber);
						updatedRows.push(row);
						//replace all instances of matchedRuleNumber in the question and answer with the next rule number
						row.json = JSON.parse(
							row.json
								.replaceAll(matchedRuleNumber, nextRule(matchedRuleNumber))
								.replace(/'/g, "''"),
						);
					}
				}
			});

			for (var row of updatedRows) {
				db.run(
					`UPDATE questions SET json = '${JSON.stringify(row.json).replace(/'/g, "''")}' WHERE id = ${row.id}`,
					function (err) {
						if (err) {
							console.log(err);
						} else {
							console.log(`Updated question ${row.id}`);
						}
					},
				);
			}
		}
	});
};

const decrementQuestionCitations = function (ruleNumber) {
	//get all the questions from the database
	db.all("SELECT * FROM questions", function (err, rows) {
		if (err) {
			console.log(err);
		}
		let updatedRows = [];
		//loop through all the questions
		rows.forEach(function (row) {
			//find ALLLLLL the citations in the question and answer, not just the first one
			const matches = [...row.json.matchAll(citationRegex)];
			for (var match of matches) {
				var matchedRuleNumber = match[1];
				//if the matchedRuleNumber is bigger than the current rule number, decrement it
				if (ruleAIsBeforeRuleB(ruleNumber, matchedRuleNumber)) {
					updatedRows.push(row);
					//replace all instances of matchedRuleNumber in the question and answer with the previous rule number
					row.json = row.json.replaceAll(
						matchedRuleNumber,
						previousRule(matchedRuleNumber),
					);
					console.log(row.id, matchedRuleNumber, row.json.match(citationRegex));
				}
			}
		});
		//now update all the questions in the database whose ids are in updatedIds
		for (var row of updatedRows) {
			db.run(
				`UPDATE questions SET json = '${JSON.stringify(row.json).replace(/'/g, "''")}' WHERE id = ${row.id}`,
				function (err) {
					if (err) {
						console.log(err);
					} else {
						console.log(`Updated question ${row.id}`);
					}
				},
			);
		}
	});
};

const fs = require("fs"),
	sqlite = require("sqlite3").verbose();

var db = new sqlite.Database("questionDatabase.db", function (err) {
	if (err) {
		console.log(err);
	}
});

const ruleCitationUpdateScript = async function (
	citationToAdd,
	citationToRemove,
) {
	try {
		//if either of the citations are not valid, throw an error
		if (citationToAdd && !citationToAdd.match(citationRegex)) {
			throw new Error(`Invalid citation to add: ${citationToAdd}`);
		}
		if (citationToRemove && !citationToRemove.match(citationRegex)) {
			throw new Error(`Invalid citation to remove: ${citationToRemove}`);
		}
		var db = new sqlite.Database("questionDatabase.db", function (err) {
			if (err) {
				console.log(err);
			} else {
				let allQuestions = db.all(
					"SELECT * FROM questions",
					function (err, rows) {
						if (err) {
							console.log(err);
						} else {
							rows.forEach(function (row) {
								console.log("a");
								row.json = JSON.parse(row.json);
								console.log("-------------");
								console.log(row.json["answer"]);
								//console.log all the citations in the question and answer using matchAll
								console.log([...row.json["answer"].matchAll(citationRegex)]);
							});
						}
					},
				);
				console.log(allQuestions.all());
			}
		});
		//		incrementQuestionCitations(citationToAdd);
		//		decrementQuestionCitations(citationToRemove);
		return true;
	} catch (error) {
		return false;
	}
};

module.exports = ruleCitationUpdateScript;
