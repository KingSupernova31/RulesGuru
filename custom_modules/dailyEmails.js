"use strict";

const sqlite = require("sqlite3").verbose(),
		fs = require("fs"),
		util = require("util"),
		path = require("path");

const rootDir = path.join(__dirname, "..");

const rgUtils = require(path.join(rootDir, "custom_modules/rgUtils.js")),
		getUnfinishedQuestion = require(path.join(rootDir, "custom_modules/getUnfinishedQuestion.js"));

rgUtils.setUpErrorHandling();

const handleEmails = function(peopleToEmail) {
	const db = new sqlite.Database(path.join(rootDir, "data_files/questions.db"), async function(err) {
		if (err) {
			rgUtils.handleError(err);
		} else {
			const promisifiedAll = util.promisify(db.all),
					dbAll = async function(arg1, arg2) {
						const result = await promisifiedAll.call(db, arg1, arg2);
						return result;
					};

			let allQuestions = await dbAll(`SELECT * FROM questions`);

			for (let i in peopleToEmail) {

				const result = getUnfinishedQuestion(peopleToEmail[i], allQuestions);

				if (result === false) {
					const emailText = `Hi ${peopleToEmail[i].name.split(" ")[0]},\n\nThanks to your help, we've approved the entire database of unfinished questions that need your attention, and there is currently nothing for you to do. I'm sure this will change soon as more questions get submitted. In the mean time, take a while to relax and look over the following images.\n\nhttps://www.google.com/search?tbm=isch&q=cute+bunny+pictures`;
					rgUtils.email(peopleToEmail[i].emailAddress, "There are no RulesGuru questions needing your attention today!", emailText);
				} else {
					const emailText = `Hi ${peopleToEmail[i].name.split(" ")[0]},\n\nYour question today is #${result.id}. Head on over to https://rulesguru.org/question-editor/?${result.id} and check it out!`;
					rgUtils.email(peopleToEmail[i].emailAddress, `Your RulesGuru question to approve`, emailText);
				}
			}
		};
	});
}

const allAdmins = rgUtils.getAdmins();
const peopleToEmail = [];
for (let i in allAdmins) {
	let sendEmail = false;
	switch (allAdmins[i].reminderEmailFrequency) {
		case "Never":
			break;
		case "Daily":
			sendEmail = true;
			break;
		case "Daily except weekends":
			if ([1, 2, 3, 4, 5].includes(new Date().getDay())) {
				sendEmail = true;
			}
			break;
		case "Every two days":
			if (Math.floor(Date.now() / 86400000) % 2 === 0) {
				sendEmail = true;
			}
			break;
		case "Every three days":
			if (Math.floor(Date.now() / 86400000) % 3 === 0) {
				sendEmail = true;
			}
			break;
		case "Every Sunday and Tuesday":
			if ([0, 2].includes(new Date().getDay())) {
				sendEmail = true;
			}
			break;
		case "Every Tuesday and Friday":
			if ([2, 5].includes(new Date().getDay())) {
				sendEmail = true;
			}
			break;
		case "Weekly":
			if (new Date().getDay() === 0) {
				sendEmail = true;
			}
			break;
	}
	if (sendEmail) {
		peopleToEmail.push(allAdmins[i]);
	}
}
handleEmails(peopleToEmail);